#!/bin/sh

##
## ВЫПОЛНЯЕТСЯ ДЛЯ ЗАПИСИ ПЕРЕМЕННЫХ ОКРУЖЕНИЯ В ФАЙЛ .env В КОНТЕЙНЕРЕ
##

touch -a parser/.env

echo "MONGO_HOST=${YOUTUBE_TOKEN}" >> parser/.env
