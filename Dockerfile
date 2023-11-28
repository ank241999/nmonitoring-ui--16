# ----------------------------
# build from source
# ----------------------------
FROM node:18.18 AS build

WORKDIR /app

COPY package*.json .
RUN npm install -g @angular/cli@16.2.6
RUN npm install -g @angular-devkit/build-angular@16.2.6
RUN npm install

COPY . /app
#RUN npm run build
RUN ng build --output-path=dist
# ----------------------------
# run with nginx
# ----------------------------
FROM nginx:1.16.0-alpine
COPY --from=build /app/dist /usr/share/nginx/html
#RUN rm /etc/nginx/conf.d/default.conf
#COPY nginx.conf /etc/nginx/conf.d
#COPY --from=build /app/dist/angular-tutorial /usr/share/nginx/html
EXPOSE 4201

# run nginx
CMD ["nginx", "-g", "daemon off;"]
