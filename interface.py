#coding=utf-8
import datetime
from db import DBConn


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


def save_compare_input(all_info, username, action='new'):
    time = datetime.datetime.now()
    db_instance = DBConn()
    cmd = "select id from analysis_master where created_by='%s'" % username
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
    else:
        db_instance.update('analysis_master', {'id': master_id}, all_info)
    for row in sample_packet_information:
        del row['id']
        row['master_id'] = master_id
        db_instance.insert('sample_packet_information', row)

    for row in compare_table:
        del row['id']
        row['master_id'] = master_id
        db_instance.insert('compare_table', row)

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
    if action == 'update':
        cmd = "select id from sample_project_master where project_number=%s" % data_info['project_number']
        result = db_instance.execute(cmd, get_all=False)
        reject_id = result[0]
        db_instance.update('sample_project_master', {'id': reject_id}, data_info)
        return reject_id
    else:
        data_info['created_by'] = username
        data_info['create_time'] = datetime.datetime.now()
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


def get_analysis_data(username):
    cmd = "select * from analysis_master where created_by='%s'" % username
    db = DBConn()
    result = db.execute(cmd, get_all=False)

    return dict(result) if result else {}


def get_user_role(username, password=''):
    db = DBConn()
    cmd = "select role from user_info where username='%s'" % username
    if password:
        cmd += " and password='%s'" % password
    result = db.execute(cmd, get_all=False)
    role = result[0] if result else ''
    return role


def save_user_info(info):
    time = datetime.datetime.now()
    info['create_time'] = time
    info['update_time'] = time
    db = DBConn()
    result = db.execute("select id from user_info where username='%s'" % info.get('username'), get_all=False)
    if not result:
        db.insert('user_info', info)
        return {'data': '', 'errcode': 0, 'msg': 'SUCCESS'}
    else:
        return {'data': '', 'errcode': 2, 'msg': '注册失败：该用户已经注册，请使用其它名字！'}


def get_detail_sample_data(project_number):
    data = []
    cmd = """SELECT d.* FROM sample_info_detail d, sample_project_master m
            where m.id=d.project_id and m.project_number=%s""" % project_number
    db = DBConn()
    results = db.execute(cmd)
    for result in results:
        data.append(dict(result))

    return data


def get_analysis_table_data(username):
    data = {}
    db = DBConn()
    cmd = """select info.* from sample_packet_information info, analysis_master m
                  where m.id=info.master_id and m.created_by='%s'""" % username
    results = db.execute(cmd)
    data['sample_packet_information'] = [dict(i) for i in results]
    cmd = """select info.* from compare_table info, analysis_master m
                  where m.id=info.master_id and m.created_by='%s'""" % username
    results = db.execute(cmd)
    data['compare_table'] = [dict(i) for i in results]

    return data


def save_status(project_number, status):
    db = DBConn()
    db.update('sample_project_master', {'project_number': project_number}, {'status': status})


def get_project_number_list(username, user_role):
    if user_role == 'manager':
        cmd = "select project_number from sample_project_master where project_leader='%s'" % username
    elif user_role == 'user':
        cmd = "select project_number from sample_project_master where created_by='%s'" % username

    db = DBConn()
    results = db.execute(cmd)

    return [i[0] for i in results]



if __name__ == '__main__':
    pass

