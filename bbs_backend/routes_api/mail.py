from celery import Celery
from marrow.mailer import Mailer

import secret
from config import server_name, admin_mail
from models.user import User

celery = Celery('mail', backend='redis://localhost/0', broker='redis://localhost')


def configured_mailer():
    config = {
        # 'manager.use': 'futures',
        'transport.debug': True,
        'transport.timeout': 1,
        'transport.use': 'smtp',
        'transport.host': 'smtp.exmail.qq.com',
        'transport.port': 465,
        'transport.tls': 'ssl',
        'transport.username': admin_mail,
        'transport.password': secret.mail_password,
    }
    m = Mailer(config)
    m.start()
    return m


mailer = configured_mailer()


@celery.task(bind=True)
def send_mail_async(self, subject, author, to, content):
    # 有了 bind 才能去拿到 self 参数
    # 这样才能去通过 self 调用当前 task 的一些功能
    # 比如重试
    try:
        m = mailer.new(
            subject=subject,
            author=author,
            to=to,
        )
        m.plain = content
        mailer.send(m)
    except Exception as exc:
        # 3秒重试一次 最多重试5次
        raise self.retry(exc=exc, countdown=3, max_retries=5)


def send_mails(sender, receivers, topic_id, floor_id, reply_content):
    content = '链接：{}\n内容：{}'.format(
        "{}/topic/{}#floor{}".format(server_name, topic_id, floor_id),
        reply_content
    )
    for r in receivers:
        subject = '你被 {} AT 了'.format(sender.username)

        author = admin_mail
        to = User.one(id=r.id).email
        send_mail_async.delay(
            subject=subject,
            author=author,
            to=to,
            content=content,
        )


def send_mail(subject, author, to, content):
    m = mailer.new(
        subject=subject,
        author=author,
        to=to,
    )
    m.plain = content

    mailer.send(m)