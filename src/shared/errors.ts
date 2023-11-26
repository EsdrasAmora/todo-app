import { TRPCError } from '@trpc/server';

export function mapDbError<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Promise<Return>,
  _context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>,
) {
  async function replacementMethod(this: This, ...args: Args): Promise<Awaited<Return>> {
    try {
      const result = await target.call(this, ...args);
      return result;
    } catch (err) {
      if (err.message === 'No values to set') {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Resource not found' });
      }
      throw err;
    }
  }
  return replacementMethod;
}

export function throwOnNotFound<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Promise<Return>,
  _context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>,
) {
  async function replacementMethod(this: This, ...args: Args): Promise<NonNullable<Awaited<Return>>> {
    const result = await target.call(this, ...args);
    if (!result) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Resource not found' });
    }
    return result;
  }
  return replacementMethod;
}
