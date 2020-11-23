# creates a layer from the node:carbon Docker image
FROM node:carbon

WORKDIR /app

COPY server/ .

RUN npm install

# expose port to have it mapped by Docker daemon
EXPOSE 3000

# define the command to run the app (it's the npm start script from the package.json file)
CMD npm start
