FROM node:latest

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build --prod
EXPOSE 80
CMD ["npx", "http-server", "dist/contacts-app-frontend"]
