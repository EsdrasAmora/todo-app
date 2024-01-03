ARG NODE_VERSION="20.10.0"
ARG ALPINE_VERSION="3.18"

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base

FROM base AS global-deps
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM global-deps AS build
WORKDIR /app
COPY . /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM build AS backend-build
RUN pnpm --filter=backend run typecheck && pnpm --filter=backend run build
# dev dependencies are not beeing pruned properly
# https://github.com/pnpm/pnpm/issues/6300
# https://github.com/pnpm/pnpm/issues/6437
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --filter=backend --prod /prod/app1

FROM base AS prod
RUN addgroup --system --gid 1001 dummy && adduser --system --uid 1001 dummy
USER dummy
WORKDIR /prod/app1
COPY --from=backend-build /prod/app1/dist ./dist
COPY --from=backend-build /prod/app1/docker.env .env
COPY --from=backend-build /prod/app1/package.json ./package.json
COPY --from=backend-build /prod/app1/node_modules ./node_modules
EXPOSE 3000

ENTRYPOINT ["npm", "run", "start"]

