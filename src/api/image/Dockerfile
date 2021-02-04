FROM node:lts-alpine as base

# This will vary on each microservice
# TODO: Add feeding in the port from a .env file

WORKDIR /app

COPY . .

RUN npm install

CMD npm start

