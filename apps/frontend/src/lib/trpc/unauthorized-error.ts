import type { TRPCClientError } from '@trpc/client';
import { redirect } from '@sveltejs/kit';

export function handleUnauthorizedError(error: TRPCClientError<any>): never {
  if (error.data?.code === 'UNAUTHORIZED') {
    redirect(302, '/login');
  }
  throw error;
}
