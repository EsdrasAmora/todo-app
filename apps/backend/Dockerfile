ARG NODE_VERSION="20.10.0"
ARG ALPINE_VERSION="3.18"

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base

FROM base AS global-deps
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && pnpm i -g turbo

FROM global-deps AS pruned-repo
WORKDIR /app
COPY . .
RUN turbo prune @project/backend --docker

FROM global-deps AS prod-deps
WORKDIR /app
# COPY .gitignore .gitignore
COPY --from=pruned-repo /app/out/json/ .
COPY --from=pruned-repo /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile


FROM global-deps AS build
WORKDIR /app
COPY --from=pruned-repo /app/out/json/ .
COPY --from=pruned-repo /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruned-repo /app/out/full/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# COPY turbo.json turbo.json
RUN pnpm run typecheck && pnpm run build

FROM base AS prod
# RUN addgroup --system --gid 1001 expressjs && adduser --system --uid 1001 expressjs
# USER expressjs
WORKDIR /home/node
# do I need to copy all node_modules?
COPY --from=prod-deps /app/node_modules ./node_modules
WORKDIR /home/node/apps/backend
COPY --from=prod-deps /app/apps/backend/node_modules ./node_modules
COPY --from=build /app/apps/backend/dist ./dist
COPY --from=build /app/apps/backend/docker.env .env
COPY --from=build /app/apps/backend/package.json ./package.json
EXPOSE 3000

ENTRYPOINT ["npm", "run", "start"]



# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM
# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

# maybe needs to  add `...` https://turbo.build/repo/docs/core-concepts/monorepos/filtering
# RUN turbo build --filter=backend
