FROM node:19.9-bullseye-slim as development

WORKDIR /app
RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*
RUN rm -f package-lock.json && rm -rf node_modules
RUN npm install -g nodemon
COPY package*.json /app/
RUN npm install
COPY . ./
EXPOSE ${BACKEND_PORT}

CMD ["/bin/sh", "./backend_watcher.sh"]