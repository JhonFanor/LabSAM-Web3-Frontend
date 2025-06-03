FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN chmod +x node_modules/.bin/* \
    && chmod +x node_modules/@esbuild/linux-x64/bin/esbuild \
    && chmod +x node_modules/.bin/tsc \
    && chmod +x node_modules/.bin/vite

EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host"]
