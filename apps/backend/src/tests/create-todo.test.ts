import { eq } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';

import { DbClient } from '../db/client';
import { TodoEntity } from '../db/schema';
import { assertValidationError } from './assert-helpers';
import { checkAuthenticatedRoute } from './auth-check';
import { clearDatabase } from './clear-db';
import { createCaller, createUser } from './test-client';

describe('Create Todo', () => {
  beforeEach(() => {
    return clearDatabase();
  });

  it('should create a todo successfully', async () => {
    const { id: userId } = await createUser();
    const client = createCaller(userId);
    const before = new Date();
    const todo = await client.todo.create({ title: 'title', description: 'description' });
    expect(todo.description).to.be.equal('description');
    expect(todo.title).to.be.equal('title');
    expect(todo.completed).to.be.false;
    expect(todo.createdAt).to.be.greaterThanOrEqual(before);
    expect(todo.updatedAt).to.be.greaterThanOrEqual(before);
    const todoDb = await DbClient.query.TodoEntity.findFirst({ where: eq(TodoEntity.id, todo.id) });
    expect(todoDb).toMatchObject(todo);
  });

  checkAuthenticatedRoute('todo', 'create');

  it('should error: empty title', async () => {
    const { id: userId } = await createUser();
    const client = createCaller(userId);
    await assertValidationError(
      client.todo.create({ title: '', description: 'description' }),
      'String must contain at least 1 character(s)',
    );
  });
});
