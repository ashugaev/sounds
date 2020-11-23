FROM nginx:1.15.11

WORKDIR /app

COPY front/dist .
COPY front/nginx.conf /etc/nginx/nginx.conf

RUN chmod -R 777 /etc/nginx/
RUN chmod -R 777 /app/

# expose port to have it mapped by Docker daemon
EXPOSE 8082

# define the command to run the app (it's the npm start script from the package.json file)
CMD nginx -g "daemon off;"
