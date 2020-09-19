##
## !!!НУЖНО ДОНАСТРОИТЬ!!!
## ВЫПОЛНЯЕТСЯ ДЛЯ ПОДГОТОВ ЧИСТОЙ ВИРТУАЛКИ ДЛЯ ДЕПЛОЯ (UBUNTU 18.1)
##

# Nginx
sudo apt update
sudo apt install nginx

# Серверный блок сайта
copy slowflow.app to /etc/nginx/sites-available/

# Активирует серверный блок в nginx
sudo ln -s /etc/nginx/sites-available/slowflow.app /etc/nginx/sites-enabled/

# Перезапуск nginx
sudo service nginx configtest
sudo service nginx restart

# Файрволл
sudo ufw enable
sudo ufw allow 'Nginx Full'
sudo ufw delete allow 'Nginx HTTP'
sudo ufw status

# SSL Сертификат
# https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04

sudo apt-get install python-certbot-nginx
sudo certbot --nginx -d slowflow.app -d www.slowflow.app --email alek-2020@yandex.ru --agree-tos --no-eff-email --redirect

# Docker
docker --version || (apt-get update && apt install docker.io -y && apt install docker-compose -y)
