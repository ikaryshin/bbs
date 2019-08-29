#!/usr/bin/env python3
import time
import logging

from flask import Flask, jsonify

import secret
import config
from models.base_model import db
from flask_cors import CORS

# from routes.index import main as index_routes
# from routes.topic import main as topic_routes, User
# from routes.reply import main as reply_routes
# from routes.board import main as board_routes
# from routes.message import main as mail_routes
from routes_api import Status, current_user
from routes_api.api_index import main as api_index_routes
from routes_api.api_topic import main as api_topic_routes
from routes_api.api_reply import main as api_reply_routes

from routes_api.api_chat import (
    socketio,
    main as api_chat_routes,
)


def time_elapsed(unix_timestamp):
    seconds_per_minute = 60
    seconds_per_hour = seconds_per_minute * 60
    seconds_per_day = seconds_per_hour * 24
    seconds_per_year = seconds_per_day * 365

    value = unix_timestamp
    now = time.time()
    time_passed = now - value

    if time_passed < seconds_per_minute:
        formatted = "不到 1 分钟"
    elif seconds_per_minute < time_passed < seconds_per_hour:
        t = int(time_passed // seconds_per_minute)
        formatted = "{} 分钟".format(t)
    elif seconds_per_hour < time_passed < seconds_per_day:
        t = int(time_passed // seconds_per_hour)
        formatted = "{} 小时".format(t)
    elif seconds_per_day < time_passed < seconds_per_year:
        t = int(time_passed // seconds_per_day)
        formatted = "{} 天".format(t)
    else:
        t = int(time_passed // seconds_per_year)
        formatted = "{} 年".format(t)

    return formatted + '前'


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

    app.template_filter()(time_elapsed)

    app.errorhandler(401)(auth_failed)

    db.init_app(app)
    socketio.init_app(app)

    register_routes(app)
    CORS(app, supports_credentials=True)

    return app


# def register_blueprint(app, blueprint, url_prefix=None):
#     app.register_blueprint(blueprint, url_prefix)


def register_routes(app):
    """
    在 flask 中，模块化路由的功能由 蓝图（Blueprints）提供
    蓝图可以拥有自己的静态资源路径、模板路径（现在还没涉及）
    用法如下
    """
    # 注册蓝图
    # 有一个 url_prefix 可以用来给蓝图中的每个路由加一个前缀

    app.register_blueprint(api_index_routes, url_prefix='/api')
    app.register_blueprint(api_topic_routes, url_prefix='/api/topic')
    app.register_blueprint(api_reply_routes, url_prefix='/api/reply')
    app.register_blueprint(api_chat_routes, url_prefix='/api/chat')

    # app.register_blueprint(index_routes)
    # app.register_blueprint(topic_routes, url_prefix='/topic')
    # app.register_blueprint(reply_routes, url_prefix='/reply')
    # app.register_blueprint(board_routes, url_prefix='/board')
    # app.register_blueprint(mail_routes, url_prefix='/mail')
    # register_blueprint(app, index_routes)
    # register_blueprint(app, topic_routes, url_prefix='/topic')
    # register_blueprint(app, reply_routes, url_prefix='/reply')
    # register_blueprint(app, board_routes, url_prefix='/board')
    # register_blueprint(app, mail_routes, url_prefix='/mail')


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
    # app.run(**config)
