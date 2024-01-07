import type { LoadEvent } from '@sveltejs/kit';
import { createTRPCProxyClient, httpLink, loggerLink, TRPCClientError } from '@trpc/client';
import { dev } from '$app/environment';
import superjson from 'superjson';

import type { AppRouter } from '@repo/backend';

export const createTrpcClient = (loadFetch: LoadEvent['fetch'] = fetch) =>
  createTRPCProxyClient<AppRouter>({
    links: [
      loggerLink({ enabled: () => false ?? dev }),
      httpLink({
        url: `http://localhost:3000/trpc`,
        fetch(url, options) {
          return loadFetch(url, {
            ...options,
            credentials: 'include',
          });
        },
      }),
    ],
    transformer: superjson,
  });

export const trpcClient = createTrpcClient();

export function isTRPCClientError(cause: unknown): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}
