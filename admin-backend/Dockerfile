ARG VERSION=latest

FROM node:${VERSION}

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 1901

CMD [ "node","server.js" ]
