from sqlalchemy import Column, Integer, UnicodeText

from models.base_model import db, SQLMixin
from models.user import User


class Reply(SQLMixin, db.Model):

    content = Column(UnicodeText, nullable=False)
    topic_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)
    floor = Column(Integer, nullable=False)

    def user(self):
        u = User.one(id=self.user_id)
        return u

    @classmethod
    def new(cls, form, user_id):
        form['user_id'] = user_id
        topic_id = form['topic_id']
        from models.topic import Topic
        topic = Topic.one(id=topic_id)
        total_floors = topic.floors_total + 1
        form['floor'] = total_floors
        m = super().new(form)
        Topic.update(topic_id, floors_total=total_floors)
        return m
