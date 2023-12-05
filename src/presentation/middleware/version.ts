import { MiddlewareHandler } from 'hono';

export function appVersion(): MiddlewareHandler {
  const version = process.env.npm_package_version;
  //if you run the server with `node dist/index.js` this will throw as npm version will not be available
  if (!version) {
    throw new Error('App version not found');
  }
  return (c, next) =>
    next().then(() => {
      c.res.headers.append('X-API-Version', version ?? '0');
    });
}
