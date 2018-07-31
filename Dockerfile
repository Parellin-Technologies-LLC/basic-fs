FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i -g pm2
RUN npm install --only=production

COPY . .

EXPOSE 3000
CMD [ "pm2", "start", "ecosystem.config.js", "--env", "production", "--no-daemon" ]
