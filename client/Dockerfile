FROM node:20-alpine AS production

WORKDIR /app

COPY --chown=node:node ./client ./client
COPY --chown=node:node ./lib ./lib

WORKDIR /app/client

RUN npm i

RUN npm run build

CMD [ "npm", "run", "start" ]
