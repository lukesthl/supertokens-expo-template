FROM node:20-slim AS builder
COPY . /app
WORKDIR /app

RUN yarn install
RUN yarn build

FROM builder
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
EXPOSE 3000
CMD [ "yarn", "start:prod" ]