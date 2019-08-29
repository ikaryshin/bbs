import uuid
from enum import Enum
from functools import wraps

import redis
from flask import request, abort, jsonify

from models.board import Board
from models.reply import Reply
from models.token import UserToken
from models.user import User
from utils import log


class Status(Enum):
    failed = False
    ok = True


class Token:
    cache = redis.StrictRedis()
    prefix = ''

    @classmethod
    def process_token(cls, token):
        return cls.prefix + token

    def __setitem__(self, token, user_id):
        token = self.process_token(token)
        Token.cache.set(token, user_id)

    def __getitem__(self, token):
        token = self.process_token(token)
        user_id = int(Token.cache.get(token))
        return user_id

    def get(self, token, value=None):
        token = self.process_token(token)
        user_id = Token.cache.get(token)
        if user_id is None:
            return value
        else:
            return int(user_id)

    @classmethod
    def set(cls, token, value):
        token = cls.process_token(token)
        cls.cache.set(token, value)

    def __contains__(self, token):
        token = self.process_token(token)
        return Token.cache.exists(token)

    def pop(self, token):
        token = self.process_token(token)
        user_id = Token.cache.get(token)
        Token.cache.delete(token)
        return int(user_id)


class AuthToken(Token):
    prefix = 'csrf_token_'

    @classmethod
    def new(cls, user_id=-1):
        token = str(uuid.uuid4())
        cls.set(token, user_id)
        return token


auth_tokens = AuthToken()


def token_required(f):
    @wraps(f)
    def func(*args):
        if request.json is not None:
            token = request.json.get('token')
        else:
            token = request.args.get('token')

        if token is None:
            return json_fail()
        else:
            return f(*args)

    return func


def topic_returned(m):
    t = m.json()
    t['user'] = User.one(id=t['user_id']).json()
    t['board'] = Board.one(id=t['board_id']).title
    replies = Reply.all(topic_id=t['id'])
    replies.sort(key=lambda r: r.created_time)
    # last_reply = replies[0].json()
    # last_reply['user'] = User.one(id=last_reply['user_id']).json()
    t['replies'] = replies_returned(replies)
    # t['replies'] = len(replies)
    return t


def replies_returned(replies):
    ms = []
    for reply in replies:
        r = reply.json()
        user_id = reply.user_id
        u = User.one(id=user_id)
        r['user'] = u.json()
        ms.append(r)
    return ms


def current_user():
    if request.json is not None:
        token = request.json.get('token')
    else:
        token = request.args.get('token')

    if token is None:
        return None
    else:
        user_token = UserToken.one(token=token)
        if user_token is not None:
            user_id = user_token.user_id
            u = User.one(id=user_id)
            return u
        else:
            return None


def json_fail(**kwargs):
    return jsonify(
        status=False,
        **kwargs,
    )


def json_succeed(**kwargs):
    return jsonify(
        status=True,
        **kwargs,
    )
