# Todo App - Nodejs Web Server

## Getting Started

Make sure to have Docker desktop installed and that nothing else is running at http://localhost:3000.  
Run `docker compose up -d --build` (root privileges may be necessary), migrate the database `pnpm migrate:dev`, then visit http://localhost:3000.  
Use the swagger UI to make requests against the web server.  
\*\*Obs: it was developed and tested only on Linux (EndevaourOS).
If the server cannot find the database with errors like `Can't reach database server at: '172.17.0.1':'5432'`, [check this article](https://medium.com/@TimvanBaarsen/how-to-connect-to-the-docker-host-from-inside-a-docker-container-112b4c71bc66)

## Developing and Testing

Create a .env file with the contents of the test.env file  
You must have NodeJS LTS version and PNPM 7 or 8 installed.  
Run `pnpm install` to install the packages, start the database with `docker compose up database -d`, and migrate the database `pnpm migrate:dev`.  
Then run `pnpm test` to run the tests.  
Or run `pnpm dev` to run the code with file watch.

## Architerure

The main idea here is to colocate use cases with schema definitions, keeping the presentation layer skinny as possible.  
The use cases being so simple and using an ORM, Drizzle, make an extra data layer unnecessary.
