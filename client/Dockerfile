###############
# Development #
###############

FROM node:20-alpine AS development

WORKDIR /app

COPY --chown=node:node ./client ./client
COPY --chown=node:node ./lib ./lib
COPY --chown=node:node ./api/libs ./api/libs

WORKDIR /app/client

RUN npm ci

RUN npm run build

CMD [ "npm", "run", "dev" ]

##############
# Production #
##############

FROM development AS production

WORKDIR /app/lib
COPY --chown=node:node --from=development ./app/lib .

WORKDIR /app/client
COPY --chown=node:node --from=development ./app/client/.next ./.next
COPY --chown=node:node --from=development ./app/client/node_modules ./node_modules
COPY --chown=node:node --from=development ./app/client/public ./public
COPY --chown=node:node --from=development ./app/client/package*.json .
COPY --chown=node:node --from=development ./app/client/next.config.js .

CMD [ "npm", "run", "start" ]
