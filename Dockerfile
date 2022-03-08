FROM node:14 AS builder
ARG NODE_ENV="production"
WORKDIR /usr/src/app
COPY ./package*.json ./
# COPY .npmrc ./
RUN npm ci
COPY . .
RUN npm run build
# RUN rm .npmrc

# Smaller image for production
FROM node:14-alpine
ARG NODE_ENV="production"
WORKDIR /usr/src/app
COPY scripts ./scripts
COPY config ./config
COPY package*.json ./
COPY tsconfig* ./
COPY ormconfig.js ./
# COPY .npmrc ./
RUN npm install tslib
RUN npm ci --only=production
# RUN rm .npmrc
COPY --from=builder /usr/src/app/dist/ ./dist/
CMD ["npm", "run", "start:prod"]