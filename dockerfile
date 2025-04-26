# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .

RUN yarn prisma generate
RUN yarn build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /usr/src/app

RUN adduser -S app

COPY --chown=app package.json yarn.lock ./
COPY --chown=app .env .env
COPY --chown=app --from=builder /usr/src/app/dist ./dist

RUN yarn install --frozen-lockfile --production
USER app
EXPOSE 3000

ENTRYPOINT ["node"]
