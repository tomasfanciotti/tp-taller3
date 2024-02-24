FROM node:20.10.0

WORKDIR /app

COPY . .

RUN yarn install
RUN npm install -g typescript
RUN yarn build
EXPOSE 3000

ENTRYPOINT ["/bin/sh"]