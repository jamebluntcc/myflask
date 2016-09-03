#coding=utf-8
import datetime
import os
import xlrd

from db import DBConn

table1_map = {
    '任单编号': 'any_single_num',
    '样品编号': 'sample_number',
    '样品名称': 'sample_name',
    '文库名称': 'library_name',
    'Index序号': 'index_num',
    'Index序列': 'index_sequence',
    '文库类型': 'library_type',
    '文库切胶长度': 'length_of_gel',
    '片段长度(bp)': 'fragment_length',
    '文库体积(ul)': 'library_volume',
    '数据量（raw data）': 'data_size'
}

def save_info(all_info, username, action='new'):
    db_instance = DBConn()
    try:
        project_id = save_sample_project_master_info(db_instance, all_info.get('sample_project_master_info'), username, action)
    except Exception, e:
        print e
        return {'data': '', 'errcode': 1, 'msg': '保存失败！项目编号已经存在，请另外选择项目编号。'}

    save_table_info(db_instance, all_info.get('table_data'), project_id, action)
    del all_info['sample_project_master_info']
    del all_info['table_data']
    for key in all_info.keys():
        table_name = key.replace('_info', '')
        data_info = all_info.get(key)
        data_info['project_id'] = int(project_id)
        if action == 'update':
             db_instance.update(table_name, {'project_id': project_id}, data_info)
        else:
             db_instance.insert(table_name, data_info)

    msg = '更新成功！' if action == 'update' else '保存成功!'
    return {'data': '', 'errcode': 0, 'msg': msg}


def get_project_id_by_num(db_instance, project_number):
    cmd = "select id from sample_project_master where project_number=%s" % project_number
    result = db_instance.execute(cmd, get_all=False)

    return result[0]


def get_project_log_by_num(db_instance, project_number):
    cmd = "select project_log from sample_project_master where project_number=%s" % project_number
    result = db_instance.execute(cmd, get_all=False)

    return result[0] or ''


def save_compare_text(selected_project, compare_data):
    try:
        file_name = os.path.dirname(__file__) + '/static/export/' + selected_project + '.txt'
        fd = open(file_name, 'w+')
        for data in compare_data:
            fd.write(data['comparison_name'] + '\n')

        fd.close()
    except Exception, e:
        print e


def save_compare_input(all_info, username, selected_project, action='new'):
    time = datetime.datetime.now()
    db_instance = DBConn()
    project_number = selected_project.split('-')[-1]
    project_id = get_project_id_by_num(db_instance, project_number)
    project_log = get_project_log_by_num(db_instance, project_number)
    all_info['project_id'] = project_id
    cmd = "select id from analysis_master where created_by='%s' and project_id=%s" % (username, project_id)
    result = db_instance.execute(cmd, get_all=False)
    if result:
        action = 'update'
        master_id = result[0]
        db_instance.delete('sample_packet_information', {'master_id': master_id})
        db_instance.delete('compare_table', {'master_id': master_id})
    sample_packet_information = all_info['sample_packet_information']
    compare_table = all_info['compare_table']
    del all_info['sample_packet_information']
    del all_info['compare_table']
    all_info['updated_by'] = username
    all_info['update_time'] = time
    if action == 'new':
        all_info['create_time'] = time
        all_info['created_by'] = username
        master_id = db_instance.insert('analysis_master', all_info)
        project_log += '\n%s: %s created compare method.\n' % (time, username)
        db_instance.update('sample_project_master', {'id': project_id}, {'project_log': project_log})
    else:
        project_log += '\n%s: %s update compare method.\n' % (time, username)
        db_instance.update('sample_project_master', {'id': project_id}, {'project_log': project_log})
        db_instance.update('analysis_master', {'id': master_id}, all_info)
    for row in sample_packet_information:
        del row['id']
        row['master_id'] = master_id
        db_instance.insert('sample_packet_information', row)

    for row in compare_table:
        del row['id']
        row['master_id'] = master_id
        db_instance.insert('compare_table', row)

    save_compare_text(selected_project, compare_table)

    msg = '更新成功！' if action == 'update' else '保存成功!'
    return {'data': '', 'errcode': 0, 'msg': msg}


def save_table_info(db_instance, table_data, project_id, action):
    if action == 'update':
        cmd = "delete from sample_info_detail where project_id=%s" % project_id
        db_instance.execute(cmd)
    for row in table_data:
        del row['id']
        row['project_id'] = project_id
        if not row.get('sample_name'):
            continue
        else:
            db_instance.insert('sample_info_detail', row)


def save_sample_project_master_info(db_instance, data_info, username, action):
    time = datetime.datetime.now()
    if action == 'update':
        cmd = "select id from sample_project_master where project_number=%s" % data_info['project_number']
        result = db_instance.execute(cmd, get_all=False)
        preject_id = result[0]
        data_info['project_log'] += "\n%s: %s update this project.\n" % (time, username)
        db_instance.update('sample_project_master', {'id': preject_id}, data_info)
        return preject_id
    else:
        data_info['created_by'] = username
        data_info['create_time'] = datetime.datetime.now()
        data_info['project_log'] = "%s: %s create new project.\n" % (time, username)
        return db_instance.insert('sample_project_master', data_info)


def show_all_data(username, role='user'):
    data = []
    cmd = """select * from sample_project_master spm,
            sample_species ss,
            sample_type st,
            dna_sample_sequencing_type dsst,
            rna_sample_sequencing_type rsst
            where ss.project_id=spm.id and
            st.project_id=spm.id and
            dsst.project_id=spm.id and
            rsst.project_id=spm.id"""
    if role == 'manager':
        cmd += " and spm.project_leader='%s'" % username
    elif role == 'user':
        cmd += " and spm.created_by='%s'" % username

    db = DBConn()
    result = db.execute(cmd)
    for i in result:
        data.append(dict(i))

    return data


def get_one_project_data(project_number):
    cmd = """select * from sample_project_master spm,
             sample_species ss,
             sample_type st,
             dna_sample_sequencing_type dsst,
             rna_sample_sequencing_type rsst,
             sample_other other
             where ss.project_id=spm.id and
             st.project_id=spm.id and
             dsst.project_id=spm.id and
             rsst.project_id=spm.id and
             other.project_id=spm.id and
             spm.project_number=%s""" % project_number
    db = DBConn()
    result = db.execute(cmd, get_all=False)
    data = dict(result)
    cmd = "select * from sample_info_detail where project_id=%s" % result['project_id']
    table_data = []
    results = db.execute(cmd)
    for result in results:
        table_data.append(dict(result))

    data['table_data'] = table_data

    return data


def get_analysis_data(username, role, selected_project):
    if not selected_project:
        return {}
    project_number = selected_project.split('-')[-1]
    cmd = """select a.* from analysis_master a,sample_project_master s
          where a.project_id=s.id and s.project_number=%s""" % project_number
    db = DBConn()
    result = db.execute(cmd, get_all=False)

    return dict(result) if result else {}


def get_user_role(username, password=''):
    db = DBConn()
    cmd = "select role from user_info where username='%s' and status='Y'" % username
    if password:
        cmd += " and password='%s'" % password
    result = db.execute(cmd, get_all=False)
    role = result[0] if result else ''
    return role


def save_user_info(info):
    time = datetime.datetime.now()
    info['create_time'] = time
    info['update_time'] = time
    info['status'] = 'R'  # 'R' means review
    db = DBConn()
    result = db.execute("select id, status from user_info where username='%s'" % info.get('username'), get_all=False)
    if not result:
        db.insert('user_info', info)
        ret = {'data': '', 'errcode': 0, 'msg': '注册成功：等待审核！'}
    else:
        status = result[1]
        if status == 'R':
            ret = {'data': '', 'errcode': 2, 'msg': '该用户之前已经注册，但状态处于等待中，请使用其它名字注册！'}
        elif status == 'Y':
            ret = {'data': '', 'errcode': 3, 'msg': '注册失败：该用户已经注册，请使用其它名字！'}
        else:
            ret = {'data': '', 'errcode': 4, 'msg': '注册失败：该用户已经存在！'}

    return ret


def get_detail_sample_data(project_number):
    data = []
    cmd = """SELECT d.* FROM sample_info_detail d, sample_project_master m
            where m.id=d.project_id and m.project_number=%s""" % project_number
    db = DBConn()
    results = db.execute(cmd)
    for result in results:
        data.append(dict(result))

    return data


def get_analysis_table_data(username, selected_project):
    data = {}
    db = DBConn()
    project_number = selected_project.split('-')[-1]
    project_id = get_project_id_by_num(db, project_number)
    cmd = """select info.* from sample_packet_information info, analysis_master m
                  where m.id=info.master_id and m.project_id=%s""" % project_id
    results = db.execute(cmd)
    data['sample_packet_information'] = [dict(i) for i in results]
    cmd = """select info.* from compare_table info, analysis_master m
                  where m.id=info.master_id and m.project_id=%s""" % project_id
    results = db.execute(cmd)
    data['compare_table'] = [dict(i) for i in results]

    return data


def save_status(project_number, status):
    db = DBConn()
    db.update('sample_project_master', {'project_number': project_number}, {'status': status})


def get_project_number_list(username, user_role):
    if user_role == 'manager':
        cmd = "select concat(project_name, '-', project_number) from sample_project_master where project_leader='%s'" % username
    elif user_role == 'user':
        cmd = "select concat(project_name, '-', project_number) from sample_project_master where created_by='%s'" % username

    db = DBConn()
    results = db.execute(cmd)

    return [i[0] for i in results]


def get_manager_list():
    db = DBConn()
    cmd = "select username from user_info where role='manager'"

    result = db.execute(cmd)

    return [i[0] for i in result]


def transfer_table_title(table_title):
    title_map = {
        '任单编号': 'any_single_num',
        '样品编号': 'sample_number',
        '样品名称': 'sample_name',
        '文库名称': 'library_name',
        'Index序号': 'index_num',
        'Index序列': 'index_sequence',
        '文库类型': 'library_type',
        '文库切胶长度': 'length_of_gel',
        '片段长度(bp)': 'fragment_length',
        '文库体积(ul)': 'library_volume',
        '数据量（raw data）': 'data_size',

        'WGCID': 'wg_cid',
        'LibID': 'lib_id',
        'SampleType': 'sample_type',
        'qRCB': 'q_rcb',
        'volume': 'volume',
        'OD': 'od',
        'RIN': 'rin',
        'LibSize': 'lib_size',
        'Quality': 'qty',

        'Original Sample Name': 'original_sample_name',
        'Project ID': 'project_id_e',
        'Yield': 'yield',
        'Reads': 'reads'

    }
    for index, title in enumerate(table_title):
        if '数据量' in title:
            title = '数据量（raw data）'

        if str(title) in title_map.keys():
            table_title[index] = title_map[str(title)]

    return table_title


def transfer_excel_to_json(file_name):
    # file_name = os.path.basename(file_name)
    data = xlrd.open_workbook(file_name)
    sheets = data.sheet_names()
    json_data = {}
    for sheet in sheets:
        table = data.sheet_by_name(sheet)
        n_rows = table.nrows
        n_cols = table.ncols
        table_data = []
        table_title = table.row_values(0)
        table_title = transfer_table_title(table_title)
        for i in range(1, n_rows):
            table_data.append(dict(zip(table_title, table.row_values(i))))
        json_data[sheet] = table_data

    return json_data


def upload_excel(io_stream):
    """
    Upload file and write it to database
    :param filename: filename
    :param io_stream: IO Stream
    :return: dict information
    """
    upload_path = os.path.dirname(__file__) + '/static/import/'
    file_path = os.path.join(upload_path, 'temp.xls')
    #juge file whether has exist
    if os.path.exists(file_path):
        os.remove(file_path)
    temp_file_path = file_path + '~'
    print 'file_path: ', file_path
    print 'temp_file_path: ', temp_file_path
    output_file = open(temp_file_path, 'wb')
    io_stream.seek(0)
    while True:
        data = io_stream.read(2 << 16)
        if not data:
            break
        output_file.write(data)

    output_file.flush()
    output_file.close()
    os.rename(temp_file_path, file_path)
    data = transfer_excel_to_json(file_path)
    return {'data': data, 'errcode': 0, 'msg': '上传成功'}

if __name__ == '__main__':
    print transfer_excel_to_json('/home/chenjialin/下载/Table.1.xls')
