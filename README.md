**Перез запуском заполнить переменные окружения в .evn**

**Как закоммитить правки в .env**

- Выключить отслеживание

  `git update-index --assume-unchanged ./.env`

- Внести правки

- Всключить отслеживание

  `git update-index --no-assume-unchanged ./.env`

**Подготовка виртуалки для деплоя**

- ```apt install docker.io && apt install docker-compose``` 
- Добавить переменные окружения в гитлабе (USER, SSH_PRIVATE_KEY
, HOST)

**Роутинг**

/ - все треки
/channels - все каналы
/chanel/[id] - конкретный канал (перейти в него можно из списка каналов или по названию канала)
/genres - все жанры
/genre/[name] - конкретный жанр (перейти в него можно из списка жанров или по тегу)

Начало работы над проектом 9 декабря 2019
