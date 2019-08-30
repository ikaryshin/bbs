# bbs
基于 Flask 和 React 的前后端分离论坛

https://www.joshuaxiao.com

## 部署流程
（以下流程在腾讯云 Ubuntu Server 18.04.1 LTS 64位下测试可行）

1. 使用默认的 ubuntu 帐号登录服务器。

2. 拉取代码
```bash
cd /home/ubuntu
git clone https://github.com/ikaryshin/bbs.git
```

3. 切换 root 帐号
```bash
# 设置 root 密码
sudo passwd root
# 切换
su root
```

4. 在 /home/ubuntu/bbs/bbs_frontend/src 中添加 config.js 文件。
```javascript
// 复制以下代码

// 填写网站的域名或是 ip 地址。不要带协议名。
const server_name = 'github.com'
// 是否使用 https
const use_https = false

export {
    server_name as server,
    use_https as useHTTPS,
}
```

5. 在 /home/ubuntu/bbs/bbs_backend 中添加 config.py 文件。
```python
# 复制以下代码

# 邮件功能，邮件发送方的邮件地址
admin_mail = ""
# 邮件功能，用户默认的邮件地址
test_mail = ""
# 服务器名，填写网站的域名或是 ip 地址。需要带上协议名。
server_name = "http://github.com"
```

6. 在 /home/ubuntu/bbs/bbs_backend 中添加 secret.py 文件。
```python
# 复制以下代码

# flask session 的 secret_key
secret_key = ""
# 邮件发送方(admin_mail)的邮箱密码
mail_password = ""
# MySQL 数据库的密码
database_password = ''
```

7. 运行部署脚本
```bash
cd /home/ubuntu/bbs
# 将数据库密码作为参数
sh deploy/deploy_v2.sh mysql_password
```

8. HTTPS 支持
- 修改 `config.py` 中的 server_name 
- 修改 `config.js` 中的 use_https
- 在 `/var/www/bbs_frontend` 中重新运行 `yarn run build`（可能出现内存不足的问题，需要停止某些服务）

```bash
# 使用 certbot https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx
# 注意先将 /etc/nginx/sites-enabled/bbs 中的 server_name 修改为需要添加 https 支持的域名
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository universe
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot python-certbot-nginx
sudo certbot --nginx
```

## 技术栈
- Flask
- SQLAlchemy
- flask_socketio
- React
- React Router
- react-mde
- react-markdown
- React-Bootstrap
- MySQL
- Redis
- Nginx
- Supervisor
- gevent
- Gunicorn
- Celery
