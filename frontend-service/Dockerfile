FROM node:current-alpine AS development

ENV CI=true
ENV PORT=3000

WORKDIR /opt
COPY package.json package-lock.json .

RUN npm ci
COPY . .

CMD [ "npm", "start" ]

FROM development AS build
RUN npm run build

FROM nginx:mainline-alpine
COPY --from=build /opt/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /opt/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
