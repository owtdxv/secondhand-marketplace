FROM node:22.16.0

WORKDIR /usr/src/socket

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]
