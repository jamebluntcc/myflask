# coding:utf-8
from flask import Flask, render_template, redirect, request, jsonify
import interface
import json

app = Flask(__name__)


@app.route('/')
def main():
    return render_template('main.html')


@app.route('/save_input', methods=['GET'])
def save_info():
    all_info = request.args.get('all_info')
    all_info = json.loads(all_info)

    return jsonify(interface.save_info(all_info))


@app.route('/show_data', methods=['GET'])
def show_data():

    return render_template('show.html')


@app.route('/get_all_data', methods=['GET', 'POST'])
def get_all_data():
    return jsonify({'data': interface.show_all_data(), 'errcode': 0, 'msg': 'Success'})


@app.route('/input_info')
def show_test_page():
    return render_template('webpage.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)