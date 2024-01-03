import type { LoadEvent } from '@sveltejs/kit';
import { createTRPCProxyClient, httpLink, loggerLink, TRPCClientError } from '@trpc/client';
import { dev } from '$app/environment';
import superjson from 'superjson';

import type { AppRouter } from '@repo/backend';

export const trpcClient = (loadFetch?: LoadEvent['fetch']) =>
  createTRPCProxyClient<AppRouter>({
    links: [
      loggerLink({ enabled: () => dev }),
      httpLink({
        url: `http://localhost:3000/trpc`,
        fetch: loadFetch,
      }),
    ],
    transformer: superjson,
  });

export function isTRPCClientError(cause: unknown): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}
