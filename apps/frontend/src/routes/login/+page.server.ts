import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { trpcClient } from '$lib/trpc';

export const actions = {
  login: async ({ cookies, request, fetch }) => {
    const data = await request.formData();
    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString();
    if (!email || !password) {
      return fail(400, { message: 'Missing required field' });
    }
    const { authorization } = await trpcClient(fetch).user.login.mutate({ email, password });
    cookies.set('authorization', authorization, {
      path: '/',
      secure: true,
      sameSite: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
    redirect(302, '/');
  },
  register: async ({ request, fetch }) => {
    const data = await request.formData();
    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString();
    if (!email || !password) {
      return fail(400, { message: 'Missing required field' });
    }
    return trpcClient(fetch).user.create.mutate({ email, password });
  },
} satisfies Actions;
