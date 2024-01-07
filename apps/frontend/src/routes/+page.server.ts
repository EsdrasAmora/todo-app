import { createTrpcClient } from '$lib/trpc';
import { handleUnauthorizedError } from '$lib/trpc/unauthorized-error';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const todos = await createTrpcClient(fetch).todo.findUserTodos.query().catch(handleUnauthorizedError);
  return { todos };
};
