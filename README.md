##На чистой виртуалке (Ubuntu 18.1)
1. Выполнить npm run initial_configure
1. Переменные окружения на гитлабе

## Первый запуск

1. Заполнить переменные окружения во всех .evn
1. `npm run install:all && npm run dev`

## Запуск в докер контейнере
1. `npm run docker-up`

##Как закоммитить правки в .env
1. Выключить отслеживание

    `git update-index --assume-unchanged ./.env`

1. Внести правки

1. Включить отслеживание

    `git update-index --no-assume-unchanged ./.env`

######Начало работы над проектом 9 декабря 2019

