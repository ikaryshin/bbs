#!/bin/bash

system_setting() {
  set -ex
  apt-get install -y zsh curl ufw
  ufw allow 22
  ufw allow 80
  ufw allow 443
  ufw allow 465
  ufw default deny incoming
  ufw default allow outgoing
  ufw status verbose
  ufw -f enable

  # redis 需要 ipv6
  sysctl -w net.ipv6.conf.all.disable_ipv6=0
  # 安装过程中选择默认选项，这样不会弹出 libssl 确认框
  export DEBIAN_FRONTEND=noninteractive
}

install_system_dependency() {
  apt-get install -y git supervisor nginx python3-pip mysql-server redis-server node.js
}

install_python_dependency() {
  pip3 install jinja2 flask gevent eventlet gunicorn pymysql flask_cors flask_socketio flask_sqlalchemy flask_mail marrow.mailer redis Celery
}

install_yarn() {
  apt-get remove -y cmdtest
  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
  sudo apt-get update
  sudo apt-get install -y yarn
}

mysql_setting() {
  local mysql_password=$1
  # 删除测试用户和测试数据库
  # 删除测试用户和测试数据库并限制关闭公网访问
  mysql -u root -p$mysql_password -e "DELETE FROM mysql.user WHERE User='';"
  mysql -u root -p$mysql_password -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"
  mysql -u root -p$mysql_password -e "DROP DATABASE IF EXISTS test;"
  mysql -u root -p$mysql_password -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';"
  # 设置密码并切换成密码验证
  mysql -u root -p$mysql_password -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$mysql_password';"
}

copy_source_code() {
  cp -r bbs_backend /var/www/bbs_backend
  cp -r bbs_frontend /var/www/bbs_frontend
}

nginx_setting() {
  # 删掉 nginx default 设置
  rm -f /etc/nginx/sites-enabled/default
  rm -f /etc/nginx/sites-available/default
  # 不要在 sites-available 里面放任何东西
  cp deploy/bbs.nginx /etc/nginx/sites-enabled/bbs
  chmod -R o+rwx /var/www/bbs_backend

  cp deploy/bbs_backend.conf /etc/supervisor/conf.d/bbs_backend.conf
}

init_backend() {
  cd /var/www/bbs_backend
  python3 reset.py
}

init_frontend() {
  # 停止服务，因为某些服务器内存不足，会出现 yarn build 失败的问题。
  service supervisor stop
  service nginx stop
  service mysql stop
  cd /var/www/bbs_frontend
  yarn install
  yarn build
}

restart_services() {
  service supervisor restart
  service nginx restart
  service mysql restart
}

run() {
  local mysql_password=$1

  system_setting
  install_system_dependency
  install_python_dependency
  install_yarn
  copy_source_code
  mysql_setting $mysql_password
  nginx_setting
  init_backend
  init_frontend
  restart_services
}

run $1
