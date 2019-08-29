import uuid

from sqlalchemy import Column, String, Integer

from models.base_model import SQLMixin, db


class UserToken(SQLMixin, db.Model):
    __tablename__ = 'user_token'
    token = Column(String(36), nullable=False)
    user_id = Column(Integer, nullable=False)

    @classmethod
    def add(cls, user_id):
        token = str(uuid.uuid4())
        form = {
            'token': token,
            'user_id': user_id
        }
        cls.new(form)
        return token
