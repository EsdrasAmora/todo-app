# Todo App - Nodejs Web Server

## Getting Started

Create a .env file with the contents of the test.env file  
Make sure to have Docker desktop installed and that nothing else is running at http://localhost:3000.  
Run `docker compose up -d --build` (root privileges may be necessary), then visit http://localhost:3000.  
Use the swagger UI to make requests against the web server.  
\*\*Obs: it was developed and tested only on Linux (EndevaourOS).
If the server cannot find the database with errors like `Can't reach database server at: 'localhost':'3000'`, [check this article](https://medium.com/@TimvanBaarsen/how-to-connect-to-the-docker-host-from-inside-a-docker-container-112b4c71bc66)

## Developing

You must have NodeJS LTS version and PNPM 7 or 8 installed.
Run `pnpm install`, then `docker compose up database -d`, then `pnpm dev`.

## Test

You must have NodeJS LTS version and PNPM 7 or 8 installed.
Run `pnpm install` then `pnpm test`.

## Architerure

The main idea here is to colocate use cases with schema definitions, keeping the presentation layer skinny as possible.
The use cases being so simple and using an ORM, Prisma, make an extra data layer unnecessary.
