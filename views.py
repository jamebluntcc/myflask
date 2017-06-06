# coding=utf-8
from flask import Flask, render_template, redirect, request, jsonify, session
from datetime import timedelta
from werkzeug.utils import secure_filename
import interface
from validate_code import get_validate_code
import json
import sys

reload(sys)
sys.setdefaultencoding('utf8')

app = Flask(__name__)
app.secret_key = 'adsfadfadsfadsfadsfadsfa'
app.permanent_session_lifetime = timedelta(hours=2)


@app.route('/')
def main():
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    user_role, status = interface.get_user_role(username)
    (e_mail, tel, company, field, customer_name) = interface.get_other_info(username)
    project_info = interface.get_project_number_list(username, user_role)
    project_info[''] = ''
    return render_template('main.html', username=username,
                           role=user_role,
                           e_mail=e_mail,
                           tel=tel,
                           company=company,
                           customer_name=customer_name,
                           field=field,
                           project_info=project_info)


@app.route('/save_input', methods=['GET'])
def save_info():
    try:
        username = session.get('login_id')
        if not username:
            return redirect('/login')
        all_info = request.args.get('all_info')
        all_info = json.loads(all_info)
        action = request.args.get('action')

        return jsonify(interface.save_info(all_info, username, action))
    except Exception, e:
        import traceback
        traceback.print_exc()


@app.route('/save_compare_input', methods=['POST'])
def save_compare_input():
    try:
        project_id = request.form['selected_project']
        username = session.get('login_id')
        if not username:
            return redirect('/login')

        all_info = request.form['all_info']
        all_info = json.loads(all_info)

        return jsonify(interface.save_compare_input(all_info, username, project_id))
    except Exception, e:
        print e
        import traceback
        traceback.print_exc()


@app.route('/login', methods=['GET'])
def login():
    return render_template('login.html')


@app.route('/save_row', methods=['POST'])
def save_row():
    return ''


@app.route('/check_login', methods=['GET', 'POST'])
def check_login():
    args = request.args
    username = args.get('username')
    pwd = args.get('password')
    user_role, status = interface.get_user_role(username, pwd)

    if not username or not pwd or not user_role:
        return jsonify({'data': '', 'errcode': 2, 'msg': '登录失败, 请确认用户名和密码输入正确！'})
    elif status == 'R':
        return jsonify({'data': '', 'errcode': 1, 'msg': '该用户还未通过审核， 请等待管理员审核！'})
    elif status == 'N':
        return jsonify({'data': '', 'errcode': 1, 'msg': '管理员拒绝通过审核或者该帐号已被禁用， 详情请联系系统管理员！'})
    elif user_role == 'user':
        session['login_id'] = username
        return jsonify({'data': '', 'errcode': 0, 'msg': '登录成功！'})
    elif user_role == 'manager':
        # TODO: show manager page
        session['login_id'] = username
        return jsonify({'data': '', 'errcode': 0, 'msg': '登录成功！'})


@app.route('/quit_login', methods=['GET', 'POST'])
def quit_login():
    session['login_id'] = None
    return redirect('/login')


@app.route('/analysis', methods=['GET'])
def analysis():
    selected_project = request.args.get('selected_project')
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    user_role, status = interface.get_user_role(username)
    data = interface.get_analysis_data(username, user_role, selected_project)
    action = 'update' if data else 'new'
    data['selected_project'] = selected_project
    sample_list = interface.get_sample_list_by_project(selected_project)
    return render_template('analysis.html', data=data,
                           action=action,
                           selected_project=selected_project,
                           sample_list=sample_list)


@app.route('/register', methods=['GET'])
def register():
    return render_template('register.html')


@app.route('/save_user_info', methods=['GET'])
def save_user_info():
    user_info = request.args.get('info')
    try:
        data = interface.save_user_info(json.loads(user_info))
    except Exception, e:
        print e
    return jsonify(data)


@app.route('/modify_base_info', methods=['GET'])
def modify_base_info():
    user_info = request.args.get('info')
    try:
        data = interface.modify_base_info(json.loads(user_info))
    except Exception, e:
        print e
    return jsonify(data)


@app.route('/change_password', methods=['GET'])
def change_password():
    user_info = request.args.get('info')
    try:
        data = interface.change_password(json.loads(user_info))
    except Exception, e:
        print e
    return jsonify(data)


@app.route('/validate_code', methods=['GET', 'POST'])
def validate_code():
    try:
        code = get_validate_code()
    except Exception, e:
        print e

    return code


@app.route('/get_all_data', methods=['GET', 'POST'])
def get_all_data():
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    role = request.args.get('role')
    data = interface.show_all_data(username, role=role)
    return jsonify({'data': data, 'errcode': 0, 'msg': 'Success'})


@app.route('/get_all_user_data', methods=['GET', 'POST'])
def get_all_user_data():
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    data = interface.get_all_user_data()
    return jsonify({'data': data, 'errcode': 0, 'msg': 'Success'})


@app.route('/get_input_info', methods=['GET', 'POST'])
def get_input_info():
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    # user_role, status = interface.get_user_role(username)
    action = request.args.get('action')
    action = 'new' if not action else action
    project_id = request.args.get('project_id')
    data = interface.get_one_project_data(project_id) if project_id else {}
    return render_template('information_sheet.html', data=data, action=action)


@app.route('/save_sample_row', methods=['GET', 'POST'])
def save_sample_row():
    return jsonify({'data': [], 'errcode': 0, 'msg': 'Success'})


@app.route('/get_detail_sample_data', methods=['GET', 'POST'])
def get_detail_sample_data():
    project_number = request.args.get('project_number')
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    data = interface.get_detail_sample_data(project_number)
    return jsonify({'data': data, 'errcode': 0, 'msg': 'Success'})


@app.route('/get_analysis_table_data', methods=['GET', 'POST'])
def get_analysis_table_data():
    project_id = request.args.get('selected_project')
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    data = interface.get_analysis_table_data(project_id)
    return jsonify({'data': data, 'errcode': 0, 'msg': 'Success'})


@app.route('/get_sample_table_data', methods=['GET', 'POST'])
def get_sample_table_data():
    project_id = request.args.get('project_id')
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    data = interface.get_sample_table_data(project_id)
    return jsonify({'data': data, 'errcode': 0, 'msg': 'Success'})


@app.route('/save_status', methods=['GET', 'POST'])
def save_status():
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    status = request.form['status']
    project_number = request.form['project_number']
    data = interface.save_status(project_number, status)
    return jsonify({'data': data, 'errcode': 0, 'msg': 'Success'})


@app.route('/admin_save_user_info', methods=['GET', 'POST'])
def admin_save_user_info():
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    status = request.form['status']
    username = request.form['username']
    data = interface.admin_save_user_info(username, status)
    return jsonify({'data': data, 'errcode': 0, 'msg': 'Success'})


@app.route('/select_project', methods=['GET', 'POST'])
def select_project():
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    user_role, status = interface.get_user_role(username)
    project_info = interface.get_project_number_list(username, user_role)

    return render_template('select_project.html', project_info=project_info)


@app.route('/upload', methods=['GET', 'POST'])
def upload():
    io_stream = request.files['fileupload']
    secure_filename(io_stream.filename)
    ret = interface.upload_excel(io_stream)
    return jsonify(ret)


@app.route('/upload_project_file', methods=['GET', 'POST'])
def upload_project_file():
    project_name = request.args.get('project_name')
    project_number = request.args.get('project_number')
    io_stream = request.files['file_data']
    filename = io_stream.filename
    try:
        ret = interface.upload_project_file(io_stream, filename, project_number, project_name)
    except Exception, e:
        import traceback
        traceback.print_exc()
    return jsonify(ret)


@app.route('/export_user_info', methods=['GET', 'POST'])
def export_user_info():
    return interface.export_user_info()


@app.route('/get_upload_page', methods=['GET', 'POST'])
def get_upload_page():
    project_id = request.args.get('project_id')
    project_info = interface.get_project_info(project_id)
    return render_template('upload_project_file.html', project_number=project_info['project_number'],
                           project_name=project_info['project_name'], project_id=project_id)


@app.route('/get_sample_page', methods=['GET', 'POST'])
def get_sample_page():
    try:
        project_id = request.args.get('project_id')
        return render_template('sample.html', project_id=project_id)
    except Exception, e:
        import traceback
        traceback.print_exc()


@app.route('/get_project_files', methods=['GET', 'POST'])
def get_project_files():
    project_number = request.args.get('project_number')
    project_name = request.args.get('project_name')

    return jsonify(interface.get_project_files(project_number, project_name))


@app.route('/save_sample_table', methods=['POST'])
def save_sample_table():
    try:
        data = request.form['sample_table_data']
        data = json.loads(data) if data else []
        project_id = request.form['project_id']
        interface.save_simple_data(project_id, data)
    except Exception, e:
        import traceback
        traceback.print_exc()

    return jsonify({'data': '保存成功!', 'errcode': 0, 'msg': 'Success'})


@app.route('/get_user_read', methods=['POST', 'GET'])
def get_user_read():
    return render_template('user_read.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
