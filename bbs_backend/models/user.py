import hashlib

from sqlalchemy import Column, String, Text

import config
import secret
from models.base_model import SQLMixin, db
from utils import log


class User(SQLMixin, db.Model):
    __tablename__ = 'user'
    """
    User 是一个保存用户数据的 model
    现在只有两个属性 username 和 password
    """
    username = Column(String(50), nullable=False)
    password = Column(String(100), nullable=False)
    image = Column(String(100), nullable=False, default='/images/3.jpg')
    email = Column(String(50), nullable=False, default=config.test_mail)
    signature = Column(Text, nullable=False, default="“ 这家伙很懒，什么个性签名都没有留下。 ”")

    @staticmethod
    def salted_password(password, salt='$!@><?>HUI&DWQa`'):
        salted = hashlib.sha256((password + salt).encode('ascii')).hexdigest()
        return salted

    @classmethod
    def register(cls, form):
        name = form.get('username', '')
        if len(name) > 2 and User.one(username=name) is None:
            form['password'] = User.salted_password(form['password'])
            u = User.new(form)
            return u
        else:
            return None

    @classmethod
    def validate_login(cls, form):
        query = dict(
            username=form['username'],
            password=User.salted_password(form['password']),
        )
        print('validate_login', form, query)
        return User.one(**query)

    @classmethod
    def change_password(cls, id, current, new):
        pwd = User.salted_password(current)
        u: User = User.one(id=id)
        if pwd == u.password:
            User.update(id, password=new)
        else:
            raise ValueError('当前密码错误')

    @classmethod
    def update_password(cls, id, new):
        pwd = User.salted_password(new)
        User.update(id, password=pwd)

    @classmethod
    def guest(cls):
        return {
            'id': -1,
            'username': '游客',
            'image': '/images/3.jpg',
            'email': '',
            'signature': "“ 这家伙很懒，什么个性签名都没有留下。 ”",
            'updated_time': None,
            'created_time': None,
        }

    def json(self):
        j = super(User, self).json()
        j.pop('password')
        return j
