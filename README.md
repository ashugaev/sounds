**Перез запуском заполнить переменные окружения в .evn**

**Как закоммитить правки в .env**

- Выключить отслеживание

  `git update-index --assume-unchanged ./.env`

- Внести правки

- Всключить отслеживание

  `git update-index --no-assume-unchanged ./.env`

**Подготовка виртуалки для деплоя**

- [Установить Docker](https://www.digitalocean.com/community/tutorials/docker-ubuntu-16-04-ru)

- [Установить Docker Compose](https://docs.docker.com/compose/install/)

Начало работы над проектом 9 декабря 2019

**Роутинг**

/ - все треки
/channels - все каналы
/chanel/[id] - конкретный канал (перейти в него можно из списка каналов или по названию канала)
/genres - все жанры
/genre/[name] - конкретный жанр (перейти в него можно из списка жанров или по тегу)
