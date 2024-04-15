##################
# STAGE 1: Build #
################## 

FROM node:20-alpine AS build

USER node

WORKDIR /app/client

COPY --chown=node:node ./client/package*.json .

RUN npm ci

WORKDIR /app

COPY --chown=node:node ./client ./client
COPY --chown=node:node ./lib ./lib

WORKDIR /app/client

RUN ls

RUN npm run build

#######################
# STAGE 2: Production #
#######################

FROM node:20-alpine AS production


WORKDIR /app/lib
COPY --chown=node:node ./lib .

WORKDIR /app/client
COPY --chown=node:node ./client/node_modules ./node_modules
COPY --chown=node:node ./client/.next ./.next
COPY --chown=node:node ./client/package*.json .
COPY --chown=node:node /client/public ./public

RUN cd .. && ls
