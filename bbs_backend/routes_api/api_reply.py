from flask import Blueprint, request

from models.reply import Reply
from models.user import User
from routes_api import (
    current_user,
    token_required,
    json_succeed,
)
from routes_api.mail import send_mails


main = Blueprint('reply', __name__)


def users_from_content(content):
    # 内容 @123 内容
    # 如果用户名含有空格 就不行了 @name 123
    # 'a b c' -> ['a', 'b', 'c']
    parts = content.split()
    users = []

    for p in parts:
        if p.startswith('@'):
            username = p[1:]
            u = User.one(username=username)
            print('users_from_content <{}> <{}> <{}>'.format(username, p, parts))
            if u is not None:
                users.append(u)

    return users


@main.route("/add", methods=['POST'])
@token_required
def add():
    form = request.json
    u = current_user()
    r = Reply.new(form, u.id)
    reply = r.json()
    reply_user = User.one(id=r.user_id)
    reply['user'] = reply_user.json()
    content = form['content']
    users = users_from_content(content)
    send_mails(u, users, form['topic_id'], r.floor, content)
    # send_mails(u, users, form['topic_id'], r.floor, content)
    return json_succeed(
        reply=reply,
    )
