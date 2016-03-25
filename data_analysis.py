# coding:utf-8
from flask import Flask, render_template, redirect, request, jsonify, session
from datetime import timedelta
import interface
import json

app = Flask(__name__)
app.secret_key = 'adsfadfadsfadsfadsfadsfa'
app.permanent_session_lifetime = timedelta(hours=2)


@app.route('/')
def main():
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    return render_template('main.html')


@app.route('/save_input', methods=['GET'])
def save_info():
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    all_info = request.args.get('all_info')
    all_info = json.loads(all_info)

    return jsonify(interface.save_info(all_info))


@app.route('/show_data', methods=['GET'])
def show_data():
    username = session.get('login_id')
    if not username:
        return redirect('/login')
    return render_template('show.html')


@app.route('/login', methods=['GET'])
def login():
    return render_template('login.html')


@app.route('/check_login', methods=['GET', 'POST'])
def check_login():
    args = request.args
    username = args.get('username')
    pwd = args.get('password')
    user_role = interface.get_user_role(username, pwd)
    if not user_role:
        return jsonify({'data': '', 'errcode': 1, 'msg': 'Login Failed！'})
    elif user_role == 'user':
        return jsonify({'data': '', 'errcode': 0, 'msg': 'Login Success！'})
    elif user_role == 'manager':
        # TODO: show manager page
        pass


@app.route('/register', methods=['GET'])
def register():

    return render_template('register.html')


@app.route('/get_all_data', methods=['GET', 'POST'])
def get_all_data():
    return jsonify({'data': interface.show_all_data(), 'errcode': 0, 'msg': 'Success'})


@app.route('/input_info')
def show_test_page():
    return render_template('webpage.html')


@app.route('/get_compare_page')
def get_compare_page():
    return render_template('compare.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)