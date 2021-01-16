#!/bin/sh

##
## ВЫПОЛНЯЕТСЯ ДЛЯ ЗАПИСИ ПЕРЕМЕННЫХ ОКРУЖЕНИЯ В ФАЙЛ .env В КОНТЕЙНЕРЕ
##

touch -a parser/.env

echo "YOUTUBE_TOKEN=${YOUTUBE_TOKEN}" >> parser/.env
