FROM node:20-alpine AS production
USER node
ENV NODE_ENV production

WORKDIR /app/lib
COPY --chown=node:node ./lib .

WORKDIR /app/api
COPY --chown=node:node ./api/package*.json .
COPY --chown=node:node ./api/tsconfig*.json .
COPY --chown=node:node ./api/nest-cli.json .
COPY --chown=node:node ./api/src ./src
COPY --chown=node:node ./api/libs ./libs
COPY --chown=node:node ./.env .

RUN npm i

RUN npm run prisma:generate

RUN npm run build

CMD [ "npm", "run", "start" ]
