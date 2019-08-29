#!/usr/bin/env python3
import logging

from flask import Flask, jsonify

import secret
from models.base_model import db
from flask_cors import CORS

from routes_api import Status, current_user

from routes_api.api_chat import (
    socketio,
    main as api_chat_routes,
)


def auth_failed(e):
    return jsonify(status=Status.failed.value)


def configured_app():
    # web framework
    # web application
    # __main__
    app = Flask(__name__)
    # 设置 secret_key 来使用 flask 自带的 session
    # 这个字符串随便你设置什么内容都可以
    app.secret_key = secret.secret_key

    uri = 'mysql+pymysql://root:{}@localhost/bbs?charset=utf8mb4'.format(
        secret.database_password
    )
    app.config['SQLALCHEMY_DATABASE_URI'] = uri
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    app.errorhandler(401)(auth_failed)

    db.init_app(app)
    socketio.init_app(app)

    register_routes(app)
    CORS(app, supports_credentials=True)

    return app


def register_routes(app):
    """
    在 flask 中，模块化路由的功能由 蓝图（Blueprints）提供
    蓝图可以拥有自己的静态资源路径、模板路径（现在还没涉及）
    用法如下
    """
    # 注册蓝图
    # 有一个 url_prefix 可以用来给蓝图中的每个路由加一个前缀

    app.register_blueprint(api_chat_routes, url_prefix='/api/chat')


# 运行代码
if __name__ == '__main__':
    app = configured_app()
    # debug 模式可以自动加载你对代码的变动, 所以不用重启程序
    # host 参数指定为 '0.0.0.0' 可以让别的机器访问你的代码
    # 自动 reload jinj, **configa
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.jinja_env.auto_reload = True
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    config = dict(
        debug=True,
        host='localhost',
        port=3000,
        # threaded=True,
    )
    logging.basicConfig(level=logging.INFO)
    # app.run(**config)
    socketio.run(app, **config)
