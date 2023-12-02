ARG NODE_VERSION="20.10.0"
ARG PNPM_VERSION="8.10.5"
ARG ALPINE_VERSION="3.18"

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run typecheck && pnpm run build && pnpm prune --prod

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION}
WORKDIR /home/node
COPY --from=build /app/docker.env ./.env
COPY --from=build /app/node_modules ./node_modules/
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist/
EXPOSE 3000

CMD ["node", "dist/index.js"]
