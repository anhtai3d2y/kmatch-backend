FROM node:12.19.0-alpine3.9 AS development

RUN apk add --no-cache udev ttf-freefont chromium git ffmpeg

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

ENV CHROMIUM_PATH /usr/bin/chromium-browser

ENV GOOGLE_APPLICATION_CREDENTIALS=/usr/src/app/key.json

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

COPY . .

# RUN npm test

EXPOSE 3000

CMD [ "npm", "run","start:dev" ]
