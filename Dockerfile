FROM node:16-alpine
LABEL maintainer="Nevermined <root@nevermined.io>"

RUN apk add --no-cache autoconf automake alpine-sdk

COPY package.json ./


COPY src ./src
COPY config ./config
COPY yarn.lock ./
COPY tsconfig* ./

RUN yarn install

RUN yarn run build

ENTRYPOINT ["yarn", "run", "start:prod"]

