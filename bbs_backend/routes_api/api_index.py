import os
import uuid
from math import ceil

from flask import (
    request,
    Blueprint,
    send_from_directory,
)

from werkzeug.datastructures import FileStorage

import config
from models.board import Board
from models.message import Message
from routes_api.mail import send_mail
from models.reply import Reply
from models.token import UserToken
from models.topic import Topic
from models.user import User
from routes_api import (
    auth_tokens,
    current_user,
    token_required,
    json_succeed,
    json_fail,
)

from utils import log

main = Blueprint('index', __name__)


def topics_for_index(board_id, page_num=1, page_limit=10):
    limit = page_limit
    offset = (page_num - 1) * page_limit
    if board_id == -1:
        ms = Topic.all_by_offset(offset, limit)
    else:
        ms = Topic.all_by_offset(offset, limit, board_id=board_id)

    topics = []
    for m in ms:
        t = m.json()
        t['user'] = User.one(id=t['user_id']).json()
        replies = Reply.all(topic_id=t['id'])
        replies.sort(key=lambda r: r.created_time)
        if len(replies) > 0:
            last_reply = replies[0].json()
            last_reply['user'] = User.one(id=last_reply['user_id']).json()
        else:
            last_reply = None
        t['lastReply'] = last_reply
        t['replies'] = len(replies)
        topics.append(t)
    log('topics', topics)
    topics.sort(key=lambda t: t['created_time'], reverse=True)

    return topics


@main.route("/index")
def index():
    board_id = int(request.args.get('board_id', -1))
    page_num = int(request.args.get('page_num', 1))
    page_limit = int(request.args.get('page_limit', 3))

    topics = topics_for_index(board_id, page_num, page_limit)
    log('board_id', board_id)
    if board_id != -1:
        count = Topic.all_count(board_id=board_id)
        log('count', count)
    else:
        count = Topic.count()
        log('count', count)

    return json_succeed(
        topics=topics,
        count=ceil(count / page_limit),
    )


@main.route("/user", methods=['POST'])
def user():
    u = current_user()
    if u is None:
        return json_fail(
            user=User.guest()
        )
    else:
        return json_succeed(
            user=u.json()
        )


@main.route("/register", methods=['POST'])
def register():
    form = request.json
    u = User.register(form)
    if u is None:
        return json_fail()
    else:
        return json_succeed(
            user=u.json(),
        )


@main.route("/login", methods=['POST'])
def login():
    form = request.json
    u = User.validate_login(form)
    if u is None:
        return json_fail()
    else:
        token = UserToken.add(u.id)
        return json_succeed(
            user=u.json(),
            token=token,
        )


@main.route('/images/<filename>')
def api_image(filename):
    return send_from_directory('images', filename)


def created_topic(user_id):
    ts = Topic.all(user_id=user_id)
    ts.sort(key=lambda t: t.created_time, reverse=True)
    return ts


def ordered_replied_topics(user_id):
    # 根据 user_id，获得按时间排好序的且不重复的，回复过的主题列表
    replies = Reply.all(user_id=user_id)
    replies.sort(key=lambda r: r.updated_time, reverse=True)

    topics = []
    topic_ids = []

    for reply in replies:
        replied_topic = Topic.one(id=reply.topic_id)
        if replied_topic.id not in topic_ids:
            topics.append(replied_topic)
            topic_ids.append(replied_topic.id)

    return topics


def topics_returned(ms):
    topics = []
    for m in ms:
        t = m.json()
        t['user'] = User.one(id=t['user_id']).json()
        replies = Reply.all(topic_id=t['id'])
        replies.sort(key=lambda r: r.created_time)
        if len(replies) > 0:
            last_reply = replies[0].json()
            last_reply['user'] = User.one(id=last_reply['user_id']).json()
        else:
            last_reply = None
        t['lastReply'] = last_reply
        t['replies'] = len(replies)
        topics.append(t)
    return topics


def user_detail(user):
    u = user
    if u is None:
        return json_fail()
    else:
        created = created_topic(u.id)
        replied = ordered_replied_topics(u.id)
        return json_succeed(
            user=u.json(),
            created=topics_returned(created),
            replied=topics_returned(replied),
        )


@main.route('/profile', methods=['POST'])
@token_required
def profile():
    u = current_user()
    return user_detail(u)


@main.route('/user/<int:id>')
def user_by_id(id):
    u = User.one(id=id)
    return user_detail(u)


@main.route('/image/add', methods=['POST'])
@token_required
def avatar_add():
    file: FileStorage = request.files['avatar']
    filename = str(uuid.uuid4())
    path = os.path.join('images', filename)
    file.save(path)

    u = current_user()
    User.update(u.id, image='/images/{}'.format(filename))

    return json_succeed()


@main.route('/setting/profile', methods=['POST'])
@token_required
def setting_profile():
    u = current_user()
    form = request.json
    username = form['name']
    signature = form['signature']
    email = form['email']

    User.update(u.id, username=username, signature=signature, email=email)

    return json_succeed()


@main.route('/setting/password', methods=['POST'])
@token_required
def setting_password():
    u = current_user()

    form = request.json
    current_password = form['current-password']
    new_password = User.salted_password(form['new-password'])

    try:
        User.change_password(u.id, current_password, new_password)
    except ValueError:
        return json_fail()

    return json_succeed()


@main.route('/reset/send', methods=['POST'])
def reset_password():
    username = request.json['username']
    log('username', username)
    u: User = User.one(username=username)
    log(u)
    if u is not None:
        token = auth_tokens.new(u.id)
        send_mail(
            subject='重置密码',
            author=config.admin_mail,
            to=u.email,
            content="{}/{}".format(config.server_name, 'reset?token={}'.format(token)),
        )
        return json_succeed()
    else:
        return json_fail()


@main.route('/reset/update', methods=['POST'])
def reset_password_update():
    token = request.json['token']
    user_id = auth_tokens.get(token, None)
    if user_id is None:
        json_fail()
    else:
        password = request.json['password']
        User.update_password(user_id, password)
        auth_tokens.pop(token)
        return json_succeed()


@main.route('/token', methods=['POST'])
def check_token():
    form = request.json
    log(form)
    token = form['token']
    if token in auth_tokens:
        return json_succeed()
    else:
        return json_fail()
