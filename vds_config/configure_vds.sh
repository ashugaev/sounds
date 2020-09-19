##
## !!!НУЖНО ДОНАСТРОИТЬ!!!
## ВЫПОЛНЯЕТСЯ ДЛЯ ПОДГОТОВ ЧИСТОЙ ВИРТУАЛКИ ДЛЯ ДЕПЛОЯ (UBUNTU 18.04)
##

sudo apt update

# Удаляет пакет, который мешает авторизации в регистре докера (проблема вылезает на одной из версий ubuntu)
sudo apt remove golang-docker-credential-helpers -y

# Nginx
sudo apt install nginx -y

# Серверный блок сайта (Выполнить из репозиторияdo)
scp vds_config/slowflow.app ssh root@slowflow.app:/etc/nginx/sites-available/

# Активирует серверный блок в nginx
sudo ln -s /etc/nginx/sites-available/slowflow.app /etc/nginx/sites-enabled/

# Перезапуск nginx
sudo service nginx configtest
sudo service nginx restart

# Файрволл
sudo ufw enable
sudo ufw allow 'Nginx Full'
sudo ufw delete allow 'Nginx HTTP'
sudo ufw allow ssh
sudo ufw status

# SSL Сертификат (без сертификата на домен вообще ничего не прососется)
# https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04
sudo apt-get install python-certbot-nginx -y
sudo certbot --nginx -d slowflow.app -d www.slowflow.app --email alek-2020@yandex.ru --agree-tos --no-eff-email --redirect

# Docker (c docker-compose из apt есть баг авторизации)
apt install docker.io -y
docker --version
apt install curl
sudo curl -L "https://github.com/docker/compose/releases/download/1.27.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
docker-compose --version
