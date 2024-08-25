FROM node:20-alpine AS base
USER node
WORKDIR /app

#########################
# STAGE 1: Development  #
#########################

# Install dependencies and build application in development environment
FROM base AS development

# Set environment variable
ENV NODE_ENV development

# Copy library code
WORKDIR /app/lib
COPY --chown=node:node ./lib .

# Copy API code and configuration files
WORKDIR /app/api
COPY --chown=node:node ./api/package*.json .
COPY --chown=node:node ./api/tsconfig*.json .
COPY --chown=node:node ./api/nest-cli.json .
COPY --chown=node:node ./api/src ./src
COPY --chown=node:node ./api/libs ./libs
COPY --chown=node:node ./.env .

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npm run prisma:generate

# Default command for development
CMD ["npm", "run", "start:debug"]

#####################
# STAGE 2: Build    #
#####################

FROM base AS build

# Set environment variable for production
ENV NODE_ENV production

# Copy application code from development stage
COPY --chown=node:node --from=development /app /app

# Change working directory to /app/api
WORKDIR /app/api

# Build the application
RUN npm run build

#####################
# STAGE 3: Production #
#####################

FROM base AS production

# Copy built application from the build stage
COPY --chown=node:node --from=build /app /app

# Set working directory to /app/api
WORKDIR /app/api

# Default command for production
CMD ["npm", "run", "start:prod"]
