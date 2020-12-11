# creates a layer from the node:carbon Docker image
FROM node:carbon

WORKDIR /app

COPY parser/ ./parser
COPY server/ ./server
COPY common/ ./common

# install packages
RUN cd parser && mkdir logs -p && npm i && cd ../server && npm i && cd ../common && npm i

# cron download
RUN apt-get update && apt-get install -y cron

# lockrun download
RUN wget unixwiz.net/tools/lockrun.c && gcc lockrun.c -o lockrun && cp lockrun /usr/local/bin/

WORKDIR /app/parser

# cron data copy
RUN crontab crontab

CMD npm run cron-init

