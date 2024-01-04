# Todo App - Nodejs Web Server

## Getting Started

### Requirements

Make sure you have the following dependencies installed on your enviroment:

1. nodejs - Use [fnm](https://github.com/Schniz/fnm) to install the latest LTS version, same as in .npmrc
1. [docker](https://docs.docker.com/get-docker/)
1. [pnpm](https://pnpm.io/installation)
1. [atlas](https://atlasgo.io/getting-started) - Database Schema and Migration management Tool

### Running tests and development mode

Run all the following commands in the root directory

```bash
# install dependencies
pnpm i
# run the database in background
docker compose up -d
# migrate the database
pnpm db:schema-push
# run tests
pnpm test
# run all apps in watch mode
pnpm dev
# Access the backend at http://localhost:3000 and the frontend at http://localhost:5173
# Optionally seed the database:
pnpm backend:seed
```

## Monorepo

1.  dev dependencies
    1. all dev dependencies should be installed in root package.json to avoid version mismatches and other headaches.
1.  directories
    1. config
       1. Place here code that _should_ be shared across **ALL** packages. They should be imported in the root package.json.
    1. packages
       1. Place here code that _can_ be shared across **multiple** packages. Avoid doing it for just organization purposes.
    1. apps
       1. These are the deployable code units.
1.  cache (turbo cache)
    1. if something is cached but shouldn't be, try to run `pnpm run clean:workspace`
1.  test
    1. we using Vitest for unit and integration tests, and playwright for E2E tests.
1.  deploy
    1. We using terraform to create the infrastructure and GitHub Actions for CI and CD pipelines.
