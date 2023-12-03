ARG NODE_VERSION="20.10.0"
ARG PNPM_VERSION="8.10.5"
ARG ALPINE_VERSION="3.18"

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS build
COPY . .
RUN pnpm run typecheck && pnpm run build && pnpm prune --prod

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION}
WORKDIR /home/node
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules/
COPY --from=build /app/dist ./dist/
COPY --from=build /app/docker.env ./.env
EXPOSE 3000

ENTRYPOINT ["node", "dist/index.js"]
