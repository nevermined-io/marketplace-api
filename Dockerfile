FROM node:16-alpine
LABEL maintainer="Nevermined <root@nevermined.io>"

RUN apk add --no-cache autoconf automake alpine-sdk

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

COPY src ./src
COPY scripts ./scripts
COPY config ./config
COPY package*.json ./
COPY tsconfig* ./
COPY ormconfig.js ./

RUN npm run build

CMD ["npm", "run", "start:prod"]

