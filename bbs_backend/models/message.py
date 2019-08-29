from sqlalchemy import Column, Unicode, Integer
from models.base_model import SQLMixin, db


class Message(SQLMixin, db.Model):
    room_id = Column(Unicode(36), nullable=False)
    sender_id = Column(Integer, nullable=False)
    receiver_id = Column(Integer, nullable=False)

    @classmethod
    def contacts(cls, user_id):
        messages_by_sender = Message.all(sender_id=user_id)
        messages_by_receiver = Message.all(receiver_id=user_id)
        messages = [*messages_by_sender, *messages_by_receiver]
        messages = list(set(messages))
        messages.sort(key=lambda m: m.updated_time)
        return messages
