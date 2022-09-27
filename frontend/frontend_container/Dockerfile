FROM node:18.9.1-buster

WORKDIR /frontend

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

CMD ["npm", "run", "start"]