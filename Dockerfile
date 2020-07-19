FROM node:12

LABEL MAINTAINER Sebastian Elisa Pfeifer <sebastian@sebastian-elisa-pfeifer.eu>

WORKDIR /app
COPY . /app
RUN npm install

EXPOSE 5000/tcp

CMD [ "node", "/app/server.js" ]
