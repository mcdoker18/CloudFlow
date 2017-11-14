FROM node:8.9.0 as builder

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
ARG BUILD_DIR=/build/

ADD package.json yarn.lock "${BUILD_DIR}"
WORKDIR "${BUILD_DIR}"
RUN yarn install

ADD . .
RUN npm run build

FROM nginx:1.13.6-alpine

COPY --from=builder "/build/dist" /opt/CloudFlow/dist
COPY scripts/cloudflow.nginx.conf /etc/nginx/conf.d/
EXPOSE 8000