FROM node:22.16.0

WORKDIR /usr/src/api

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start:prod"]
