##################
# STAGE 1: Build #
##################

FROM node:20-alpine AS development

USER node

WORKDIR /app/lib
COPY --chown=node:node ./lib .

WORKDIR /app/api
COPY --chown=node:node ./api/package*.json .
COPY --chown=node:node ./api/nest-cli.json .
COPY --chown=node:node ./api/tsconfig*.json .
COPY --chown=node:node ./api/src ./src
COPY --chown=node:node ./api/libs ./libs

RUN npm ci

RUN ls

RUN npm run prisma:generate

#######################
# STAGE 2: Production #
#######################

FROM node:20-alpine As build

WORKDIR /app

COPY --chown=node:node --from=development /app .

ENV NODE_ENV production

RUN cd api && npm run build

#######################
# STAGE 3: Deploy #
#######################

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=build /app .

WORKDIR /app/api

RUN ls

CMD [ "npm", "run", "start" ];
