import { trpcClient } from '$lib/trpc';
import { handleUnauthorizedError } from '$lib/trpc/unauthorized-error';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  const todos = await trpcClient(fetch).todo.findUserTodos.query().catch(handleUnauthorizedError);
  return { todos };
};
