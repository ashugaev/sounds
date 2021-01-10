# creates a layer from the node:carbon Docker image
FROM node:carbon

WORKDIR /app

COPY server/ ./server
COPY common/ ./common

RUN cd server && npm i && cd ../common && npm i
# for debugging
RUN apt-get update && apt-get install nano curl -y

# expose port to have it mapped by Docker daemon
EXPOSE 3000

WORKDIR /app/server

# define the command to run the app (it's the npm start script from the package.json file)
CMD npm start
