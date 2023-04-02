# ---- Args ----
ARG NODE_VERSION="18.12.1"
ARG ALPINE_VERSION="3.17"

# ---- Base Node ----
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base
WORKDIR /home/app
RUN apk add --no-cache curl && \
    curl -fsSL "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" -o /bin/pnpm && chmod +x /bin/pnpm && \
    apk del curl
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# ---- Build ----
FROM base AS build
COPY . .
RUN pnpm run db:codegen
RUN pnpm run typecheck
RUN pnpm run build
RUN pnpm prune --prod

# ---- Release ----
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION}

WORKDIR /home/node
COPY docker.env ./.env
COPY --from=build /home/app/node_modules ./node_modules/
COPY --from=build /home/app/dist ./dist/
EXPOSE 3000

ENTRYPOINT ["node", "dist/index.js"]
