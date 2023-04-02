import { randomUUID } from 'crypto';
import { appRouter } from '../presentation/router';
import { contextSymbol } from '../presentation/trpc.context';
import { JwtService } from '../shared/jwt';

export function createCaller(userId: string) {
  return appRouter.createCaller({ authorization: JwtService.sign({ userId }), [contextSymbol]: true });
}

export function createFakeCaller() {
  // const user = await prisma.user.create({
  //   data: { email: 'foo@bar.com', hashedPassword: '123', passwordSalt: '321' },
  //   select: { id: true },
  // });
  const authorization = JwtService.sign({ userId: randomUUID() });
  return appRouter.createCaller({ authorization, [contextSymbol]: true });
}

export function createUnauthorizedCaller() {
  return appRouter.createCaller({ authorization: undefined, [contextSymbol]: true });
}
