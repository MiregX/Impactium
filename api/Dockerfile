
###################
# STAGE 2: Build for development
###################

FROM node:20-alpine AS development

WORKDIR /api

# Копируем папку api
COPY . .

RUN npm ci

RUN npm run prisma:generate

USER node

###################
# STAGE 3: Build for production
###################

FROM development AS build

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

###################
# STAGE 4: Production
###################

FROM node:20-alpine AS production

WORKDIR /api

COPY --from=build /api ./

CMD [ "node", "dist/src/main.js" ]
