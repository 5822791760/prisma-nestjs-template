# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /usr/src/app

RUN adduser -S app

COPY --chown=app package.json package-lock.json ./
COPY --chown=app .env .env
COPY --chown=app --from=builder /usr/src/app/dist ./dist
COPY --chown=app --from=builder /usr/src/app/package.json ./package.json

RUN npm ci --omit=dev
USER app
EXPOSE 3000

ENTRYPOINT ["npm", "run"]
