FROM node:22.16.0 as builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

COPY .env .env

RUN npm run build

FROM nginx:alpine

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
