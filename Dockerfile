FROM alpine:latest

LABEL MAINTAINER Sebastian Elisa Pfeifer <sebastian@sebastian-elisa-pfeifer.eu>

WORKDIR /app
COPY . /app

RUN apk --update add nodejs npm
RUN cd /app && npm install

EXPOSE 5000/tcp

CMD [ "node", "/app/server.js" ]
