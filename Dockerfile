# ---- Args ----
ARG NODE_VERSION="20.10.0"
ARG PNPM_VERSION="8.10.5"
ARG ALPINE_VERSION="3.17"

# ---- Base Node ----
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base
WORKDIR /home/app
COPY package.json pnpm-lock.yaml ./
RUN npm install --global pnpm@${PNPM_VERSION} && pnpm install

# ---- Build ----
FROM base AS build
COPY . .
RUN pnpm run typecheck && pnpm run build && pnpm prune --prod

# ---- Release ----
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION}

WORKDIR /home/node
COPY docker.env ./.env
COPY --from=build /home/app/node_modules ./node_modules/
COPY --from=build /home/app/package.json ./package.json
COPY --from=build /home/app/dist ./dist/
EXPOSE 3000

ENTRYPOINT ["node", "dist/index.js"]
