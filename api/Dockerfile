FROM node:20-alpine AS production
USER node
ENV NODE_ENV production

WORKDIR /app/lib
COPY --chown=node:node ./lib .

WORKDIR /app/api
COPY --chown=node:node ./api .
COPY --chown=node:node ./.env .

RUN npm i

RUN npm run build

RUN npm run prisma:generate

CMD [ "npm", "run", "start:prod" ]
