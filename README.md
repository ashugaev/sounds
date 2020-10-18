## На чистой виртуалке (Ubuntu 18.04)
1. Установить ssh ключ на виртуалку (на vdsina нужно переустановить Ubuntu после добавления)
1. Выполнить npm run initial_configure (пока не работает и нужно выполтить команды руками)
1. Переменные окружения на гитлабе

## Первый запуск

1. Заполнить переменные окружения во всех .evn
1. `npm run install:all && npm run dev`

## Запуск в докер контейнере
1. `npm run docker-up`

## Как закоммитить правки в .env
1. Выключить отслеживание

    `git update-index --assume-unchanged ./.env`

1. Внести правки

1. Включить отслеживание

    `git update-index --no-assume-unchanged ./.env`

## Подготовка ide
1. Пометрить директории из aliases в вебпаке "Mark as Resourse Root"
2. Указать вебшторму на конфиг вебпака в **"Preferences | Languages & Frameworks | JavaScript | Webpack"**
