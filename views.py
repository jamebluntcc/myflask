#coding=utf-8
from flask import Flask, render_template, redirect, request, jsonify, session
from datetime import timedelta
from werkzeug.utils import secure_filename
import interface
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
    user_role = interface.get_user_role(username)
    project_num_list = ['']
    project_num_list += interface.get_project_number_list(username, user_role)
    return render_template('main.html', username=username, role=user_role, project_num_list=project_num_list)


@app.route('/save_input', methods=['GET'])
def save_info():
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    all_info = request.args.get('all_info')
    all_info = json.loads(all_info)
    action = request.args.get('action')

    return jsonify(interface.save_info(all_info, username, action))


@app.route('/save_compare_input', methods=['GET'])
def save_compare_input():
    selected_project = request.args.get('selected_project')
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    all_info = request.args.get('all_info')
    all_info = json.loads(all_info)

    return jsonify(interface.save_compare_input(all_info, username, selected_project))


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
    user_role = interface.get_user_role(username, pwd)
    if not username or not pwd or not user_role:
        return jsonify({'data': '', 'errcode': 1, 'msg': 'Login Failed！'})
    elif user_role == 'user':
        session['login_id'] = username
        return jsonify({'data': '', 'errcode': 0, 'msg': 'Login Success！'})

    elif user_role == 'manager':
        # TODO: show manager page
        session['login_id'] = username
        return jsonify({'data': '', 'errcode': 0, 'msg': 'Login Success！'})


@app.route('/analysis', methods=['GET'])
def analysis():
    selected_project = request.args.get('selected_project')
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    user_role = interface.get_user_role(username)
    data = interface.get_analysis_data(username, user_role, selected_project)
    action = 'update' if data else 'new'
    project_list = interface.get_project_number_list(username, user_role)
    data['selected_project'] = selected_project
    return render_template('analysis.html', data=data, action=action,
                           project_list=project_list, selected_project=selected_project)


@app.route('/register', methods=['GET'])
def register():
    return render_template('register.html')


@app.route('/save_user_info', methods=['GET'])
def save_user_info():
    user_info = request.args.get('info')
    data = interface.save_user_info(json.loads(user_info))
    return jsonify(data)


@app.route('/get_all_data', methods=['GET', 'POST'])
def get_all_data():
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    role = request.args.get('role')
    data = interface.show_all_data(username, role=role)
    return jsonify({'data': data, 'errcode': 0, 'msg': 'Success'})


@app.route('/input_info')
def input_info():
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    user_role = interface.get_user_role(username)
    action = request.args.get('action')
    action = 'new' if not action else action
    project_number = request.args.get('project_number')
    data = interface.get_one_project_data(project_number) if project_number else {}
    manager_list = interface.get_manager_list()

    return render_template('user_input.html', data=data, action=action, role=user_role, manager_list=manager_list)


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
    selected_project = request.args.get('selected_project')
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    data = interface.get_analysis_table_data(username, selected_project)
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


@app.route('/select_project', methods=['GET', 'POST'])
def select_project():
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    user_role = interface.get_user_role(username)
    project_list = interface.get_project_number_list(username, user_role)

    return render_template('select_project.html', project_list=project_list)


@app.route('/upload', methods=['GET', 'POST'])
def upload():
    io_stream = request.files['fileupload']
    secure_filename(io_stream.filename)
    ret = interface.upload_excel(io_stream)
    return jsonify(ret)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)