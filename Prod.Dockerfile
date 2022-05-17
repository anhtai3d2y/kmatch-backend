FROM node:12.19.0-alpine3.9 AS production

RUN apk add udev ttf-freefont chromium git ffmpeg

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

ENV CHROMIUM_PATH /usr/bin/chromium-browser

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --silent

COPY . .

# RUN npm test

RUN npm run-script build

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
