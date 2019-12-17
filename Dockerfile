FROM node:10.14.1-alpine

ARG NODE_ENV

ENV NODE_ENV ${NODE_ENV:-dev}

RUN mkdir app

WORKDIR /app

ADD package*.json /app/

RUN npm install

run ls

ADD ./dist /app/dist/

EXPOSE 8080

CMD npm run start:${NODE_ENV}
