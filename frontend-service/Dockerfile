FROM node:lts

WORKDIR /opt

COPY package.json package-lock.json .

RUN npm ci

COPY . .

CMD ["npm", "start"]