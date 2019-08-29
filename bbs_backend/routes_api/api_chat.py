import uuid

from flask import Blueprint, request
from flask_socketio import (
    emit,
    join_room,
    leave_room,
    SocketIO
)

from models.message_content import MessageContent
from models.message import Message
from models.token import UserToken
from models.user import User
from routes_api import token_required, current_user, json_succeed, Status, json_fail
from utils import log

socketio = SocketIO()


def current_sender(data):
    token = data['token']
    joiner_id = UserToken.one(token=token).user_id


@socketio.on('join', namespace='/api/chat')
def join(data):
    room = data['room']
    token = data['token']
    message = Message.one(room_id=room)
    joiner_id = UserToken.one(token=token).user_id
    if joiner_id not in (message.sender_id, message.receiver_id):
        d = dict(
            message=False,
        )
    else:
        join_room(room)
        d = dict(
            message=True,
        )
    log('join', data, d)
    emit('status', d, room=room)


@socketio.on('send', namespace='/api/chat')
def send(data):
    log('send', data)

    token = data.get('token')
    sender_id = UserToken.one(token=token).user_id

    content = data.get('content')
    room_id = data.get('room_id')
    message = Message.one(room_id=room_id)
    message_id = message.id
    receiver_id = message.receiver_id
    if sender_id == receiver_id:
        receiver_id = message.sender_id

    form = {
        'content': content,
        'message_id': message_id,
        'sender_id': sender_id,
        'receiver_id': receiver_id,
    }
    m = MessageContent.new(form)
    Message.update(message.id)

    # d = dict(
    #     sender=sender_id,
    #     receiver=receiver_id,
    #     content=content,
    # )
    # log('chat sent', d, room_id)
    m = m.json()
    emit('message', m, room=room_id)


main = Blueprint('chat', __name__)


@main.route('/new', methods=['POST'])
@token_required
def new_chat():
    sender = current_user()
    form = request.json
    receiver_id = form['receiver_id']
    if receiver_id == sender.id:
        return json_fail()
    else:
        room_id = str(uuid.uuid4())
        form['room_id'] = room_id
        form['sender_id'] = sender.id
        message = Message.one(sender_id=sender.id, receiver_id=receiver_id)
        if message is None:
            Message.new(form)
            return json_succeed(
                room=room_id
            )
        else:
            return json_succeed(room=message.room_id)


@main.route('/contacts', methods=['POST'])
@token_required
def contacts():
    u = current_user()
    all_contacts = Message.contacts(user_id=u.id)

    contacts_returned = [c.json() for c in all_contacts]
    contacts_returned.sort(key=lambda c: c['updated_time'])

    for c in contacts_returned:
        if c['receiver_id'] == u.id:
            c['other'] = User.one(id=c['sender_id']).json()
        elif c['sender_id'] == u.id:
            c['other'] = User.one(id=c['receiver_id']).json()
        # 都不满足，就会没有 other 字段

    return json_succeed(
        user=u.json(),
        contacts=contacts_returned,
    )


@main.route('/messages', methods=['POST'])
@token_required
def messages():
    room_id = request.json['room']
    message_id = Message.one(room_id=room_id).id

    all_messages = MessageContent.all(message_id=message_id)

    messages_returned = [m.json() for m in all_messages]

    return json_succeed(
        messages=messages_returned,
    )
