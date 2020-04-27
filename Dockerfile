FROM node:12.13

RUN \
  apt update && \
  apt-get install -y nginx socat

WORKDIR /usr/src/frontend

# Skip Cypress Install
ENV CYPRESS_INSTALL_BINARY 0

# Install dependencies first
COPY package*.json ./
RUN npm install --unsafe-perm

COPY . .

ARG PORT=3000
ENV PORT $PORT

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG API_URL=https://api-staging.opencollective.com
ENV API_URL $API_URL

ARG INTERNAL_API_URL=https://api-staging-direct.opencollective.com
ENV INTERNAL_API_URL $INTERNAL_API_URL

ARG IMAGES_URL=https://images-staging.opencollective.com
ENV IMAGES_URL $IMAGES_URL

ARG INVOICES_URL=https://invoices-staging.opencollective.com
ENV INVOICES_URL $INVOICES_URL

ARG GIFTCARDS_GENERATOR_URL=https://giftcards-generator-staging.opencollective.com
ENV GIFTCARDS_GENERATOR_URL $GIFTCARDS_GENERATOR_URL

ARG API_KEY=09u624Pc9F47zoGLlkg1TBSbOl2ydSAq
ENV API_KEY $API_KEY

RUN npm run build

RUN npm prune --production

EXPOSE $PORT

RUN find /usr/src/frontend/dist/ -type f -exec gzip -k9 {} \;

CMD echo "\
events {}\n\
http {\n\
  include mime.types;\n\
  server { \n\
    listen $PORT;\n\
    gzip_static on;\n\
    gzip_vary on;\n\
    gzip_proxied any;\n\
    location /static {\n\
      sendfile on;\n\
      tcp_nopush on;\n\
      alias /usr/src/frontend/dist/public/static;\n\
      add_header Cache-Control \"public\";\n\
    }\n\
    location /_next/static {\n\
      sendfile on;\n\
      tcp_nopush on;\n\
      alias /usr/src/frontend/dist/.next/static;\n\
      add_header Cache-Control \"public\";\n\
    }\n\
    location / {\n\
      proxy_pass http://127.0.0.1:4321;\n\
    }\n\
  }\n\
}\
" > /etc/nginx/nginx.conf && mkdir -p -m 755 /var/log/nginx/ && nginx && PORT=4321 npm run start