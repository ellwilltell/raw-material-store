FROM node:20 AS production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "node", "dist/main.js" ]





FROM node:20 AS development

WORKDIR /usr/src/app

USER node

#COPY --chown=node:node package*.json ./

#RUN npm ci

#COPY --chown=node:node . .


CMD [ "npm", "run", "start:dev" ]
