####################
# STAGE 1: Prepare #
####################

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
COPY --chown=node:node ./api/node_modules ./node_modules
COPY --chown=node:node ./api/libs ./libs
COPY --chown=node:node ./.env .

RUN npm run prisma:generate

CMD [ "npm", "run", "start:debug" ]

##################
# STAGE 2: Build #
##################

FROM node:20-alpine As build

ENV NODE_ENV production

COPY --chown=node:node --from=development /app /app

WORKDIR /app/api

RUN npm run build

CMD [ "npm", "run", "start" ]

###################
# STAGE 3: Deploy #
###################

FROM node:20-alpine AS production

COPY --from=build /app /app

WORKDIR /app/api

CMD [ "npm", "run", "start:prod" ]
