###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20-alpine As development

WORKDIR /usr/src/api

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run prisma:generate

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:20-alpine As build

WORKDIR /usr/src/api

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/api/node_modules ./node_modules

COPY --chown=node:node --from=development /usr/src/api/.prisma ./.prisma

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:20-alpine As production

COPY --chown=node:node --from=build /usr/src/api/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/api/dist ./dist
COPY --chown=node:node --from=build /usr/src/api/.prisma ./.prisma
COPY --chown=node:node --from=build /usr/src/api/libs/main/prisma ./libs/main/prisma
# COPY --chown=node:node --from=build /usr/src/api/libs/mcs/prisma ./libs/mcs/prisma
COPY --chown=node:node package*.json ./

CMD [ "node", "dist/src/main.js" ]
