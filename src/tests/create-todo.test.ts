import { expect } from 'chai';
import { prisma } from '../db/client';
import { assertValidationError } from './assert-helpers';
import { checkAuthorizedRoute } from './auth-check';
import { clearDatabase } from './clear-db';
import { createCaller, createUser } from './test-client';

describe('Create Todo', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('should create a todo successfully', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    const before = new Date();
    const todo = await client.todo.create({ title: 'title', description: 'description' });
    expect(todo.description).to.be.equal('description');
    expect(todo.title).to.be.equal('title');
    expect(todo.completed).to.be.false;
    expect(todo.createdAt).to.be.greaterThan(before);
    expect(todo.updatedAt).to.be.greaterThan(before);
    const todoDb = await prisma.todo.findUnique({ where: { id: todo.id } });
    expect(todoDb).excluding(['userId', 'deletedAt']).to.deep.equal(todo);
  });

  checkAuthorizedRoute('todo', 'create');

  it('should error: empty title', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    await assertValidationError(
      client.todo.create({ title: '', description: 'description' }),
      'String must contain at least 1 character(s)',
    );
  });
});
