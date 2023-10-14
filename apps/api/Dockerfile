FROM node:20-slim AS base
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN yarn install --production

FROM base AS build
RUN yarn build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE 3000
CMD [ "yarn", "start:prod" ]