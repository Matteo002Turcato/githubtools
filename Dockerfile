# SERVER BUILDER STAGE
FROM node:18-alpine as server-builder
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache libssl1.1
WORKDIR /app

COPY server/package.json server/yarn.lock ./

RUN yarn install --frozen-lockfile

# Generate prisma client
COPY server/prisma/schema.prisma ./prisma/schema.prisma
RUN npx prisma generate

# Copy all files
COPY server .

# Build server
RUN yarn build

# CLIENT BUILDER STAGE
FROM node:18-alpine as client-builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY client/package.json client/yarn.lock ./

RUN yarn install --frozen-lockfile

# Copy all files
COPY client .

# Build client
RUN yarn build

# RUNNER STAGE
FROM node:18-alpine AS runner
# RUN apk add busybox-suid
RUN apk add --no-cache libssl1.1
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

ENV PORT 5000
ENV NODE_ENV production

EXPOSE 5000

COPY --from=server-builder /app/package.json ./package.json
COPY --from=server-builder /app/yarn.lock ./yarn.lock

RUN yarn install --production --frozen-lockfile

# # Generate prisma client
# COPY --from=server-builder /app/prisma/migrations ./prisma/migrations
# COPY --from=server-builder /app/prisma/schema.prisma ./prisma/schema.prisma

# RUN npx prisma generate

# COPY --from=server-builder /app/build ./
# COPY --from=client-builder /app/build ./public

# Copy start script
COPY start-production.sh ./start-production.sh
RUN chmod +x ./start-production.sh

# Cron job


# USER expressjs

CMD ["./start-production.sh"]