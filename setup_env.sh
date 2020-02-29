#!/bin/sh

##
## ВЫПОЛНЯЕТСЯ ДЛЯ ЗАПИСИ ПЕРЕМЕННЫХ ОКРУЖЕНИЯ В ФАЙЛ .env В КОНТЕЙНЕРУ
##

touch -a server/.env

echo "MONGO_USER_NAME=${MONGO_USER_NAME}" >> server/.env
echo "MONGO_USER_PASSWORD=${MONGO_USER_PASSWORD}" >> server/.env
echo "MONGO_HOST=${MONGO_HOST}" >> server/.env
