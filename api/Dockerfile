##################
# STAGE 1: Build #
##################

FROM node:20-alpine AS development
USER node
ENV NODE_ENV development

WORKDIR /app/lib
COPY --chown=node:node ./lib .

WORKDIR /app/api
COPY --chown=node:node ./api/package*.json .
COPY --chown=node:node ./api/tsconfig*.json .
COPY --chown=node:node ./api/nest-cli.json .
COPY --chown=node:node ./api/src ./src
COPY --chown=node:node ./api/libs ./libs
COPY --chown=node:node ./.env .

RUN npm ci
RUN npm run prisma:generate

#######################
# STAGE 2: Production #
#######################

FROM node:20-alpine As build

ENV NODE_ENV production

COPY --chown=node:node --from=development /app /app

WORKDIR /app/api

RUN npm run build

###################
# STAGE 3: Deploy #
###################

FROM node:20-alpine AS production

COPY --from=build /app /app

WORKDIR /app/api

RUN npm run prisma:deploy

CMD [ "node", "dist/api/src/main.js" ]
