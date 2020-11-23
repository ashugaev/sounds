# creates a layer from the node:carbon Docker image
FROM node:carbon

WORKDIR /app

COPY parser/ .

RUN npm install

# cron download
RUN apt-get update && apt-get install -y cron

# cron data copy
RUN crontab crontab

CMD npm run cron-init

