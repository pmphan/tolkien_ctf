FROM node:current-alpine AS dev

ENV CI=true
ENV PORT=80

WORKDIR /opt
COPY package.json package-lock.json .

RUN npm ci
COPY . .

CMD [ "npm", "start" ]

FROM dev AS build
RUN npm run build

FROM nginx:mainline-alpine as prod
COPY --from=build /opt/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /opt/build /usr/share/nginx/html
COPY src/images /images
CMD ["nginx", "-g", "daemon off;"]
