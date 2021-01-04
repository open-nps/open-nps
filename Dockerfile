FROM mhart/alpine-node:latest

ENV MONGO_URL ''

ADD . /app
WORKDIR /app

RUN yarn install \
    && yarn build \
    && rm -rf node_modules \
    && yarn install --production

CMD ["yarn", "start"]
