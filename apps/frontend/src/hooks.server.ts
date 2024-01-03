import type { HandleFetch } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handleFetch: HandleFetch = async ({ fetch, request, event }) => {
  if (
    request.url.startsWith('http://localhost:3000') &&
    (!request.url.endsWith('/trpc/user.login') || !request.url.endsWith('/trpc/user.create'))
  ) {
    const authorization = event.cookies.get('authorization');
    if (!authorization) {
      redirect(302, '/login');
    }
    request.headers.set('authorization', authorization);
  }
  return fetch(request);
};
