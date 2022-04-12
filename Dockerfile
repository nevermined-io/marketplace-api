FROM node:16-alpine
LABEL maintainer="Nevermined <root@nevermined.io>"

RUN apk add --no-cache autoconf automake alpine-sdk

COPY package*.json ./

RUN npm install 

COPY src ./src
COPY config ./config
COPY package*.json ./
COPY tsconfig* ./
COPY ormconfig.js ./

RUN npm run build

ENTRYPOINT ["npm", "run", "start:prod"]

