from db import DBConn


def save_info(all_info):

    project_id = save_sample_project_master_info(all_info.get('sample_project_master_info'))
    db = DBConn()
    del all_info['sample_project_master_info']
    for key in all_info.keys():
        table_name = key.replace('_info', '')
        data_info = all_info.get(key)
        data_info['project_id'] = project_id
        db.insert(table_name, data_info)

    return {'data': '', 'errcode': 0, 'msg': 'SUCCESS'}


def save_sample_project_master_info(data_info):
    print "#"*10
    print 'data_info: ', data_info
    db = DBConn()
    return db.insert('sample_project_master', data_info)

    pass

def sample_species_info(data_info):
    pass

def sample_type_info(data_info):
    pass

def dna_sample_sequencing_type_info(data_info):
    pass

def rna_sample_sequencing_type_info(data_info):
    pass

# all_info = {
    #     'sample_project_master_info': sample_project_master_info,
    #     'sample_species_info': sample_species_info,
    #     'sample_type_info': sample_type_info,
    #     'dna_sample_sequencing_type_info': dna_sample_sequencing_type_info,
    #     'rna_sample_sequencing_type_info': rna_sample_sequencing_type_info
    # }
def show_all_data():
    data = []
    cmd = """select * from sample_project_master spm,
            sample_species ss,
            sample_type st,
            dna_sample_sequencing_type dsst,
            rna_sample_sequencing_type rsst
            where ss.project_id=spm.id and st.project_id=spm.id and dsst.project_id=spm.id and rsst.project_id=spm.id"""

    db = DBConn()
    result = db.execute(cmd)
    for i in result:
        data.append(dict(i))

    return data


if __name__ == '__main__':
    print show_all_data()
