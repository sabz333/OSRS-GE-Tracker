FROM node:20.11

WORKDIR /home/app/node_modules

RUN mkdir -p /home/app/node_modules \
&& chown node:node /home/app/node_modules

WORKDIR /home/app

COPY package.json package.json

RUN npm install \
&& npm cache clean --force

COPY . .

CMD [ "npm", "start" ]