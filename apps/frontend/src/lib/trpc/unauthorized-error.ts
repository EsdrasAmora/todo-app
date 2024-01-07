import type { TRPCClientError } from '@trpc/client';
import { error, redirect } from '@sveltejs/kit';

export function handleUnauthorizedError(err: TRPCClientError<any>): never {
  if (err.data?.code === 'UNAUTHORIZED') {
    redirect(302, '/login');
  }
  error(500, 'Something went wrong');
}
