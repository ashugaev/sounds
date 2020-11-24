# creates a layer from the node:carbon Docker image
FROM node:carbon

WORKDIR /app

COPY parser/ ./parser
COPY server/ ./server

# install packages
RUN cd parser && npm i && cd ../server && npm i

# cron download
RUN apt-get update && apt-get install -y cron

# lockrun download
RUN wget unixwiz.net/tools/lockrun.c && gcc lockrun.c -o lockrun && cp lockrun /usr/local/bin/

# cron data copy
RUN crontab parser/crontab

CMD npm run cron-init

