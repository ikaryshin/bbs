from sqlalchemy import Column, UnicodeText, Integer

from models.base_model import SQLMixin, db


class MessageContent(SQLMixin, db.Model):
    message_id = Column(Integer, nullable=False)
    content = Column(UnicodeText, nullable=False)
    sender_id = Column(Integer, nullable=False)
    receiver_id = Column(Integer, nullable=False)
