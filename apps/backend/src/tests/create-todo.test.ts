import { beforeEach, describe, expect } from 'vitest';

import { Database } from '../db/client';
import { assertValidationError } from './assert-helpers';
import { checkAuthenticatedRoute } from './auth-check';
import { clearDatabase } from './clear-db';
import { authTest } from './test-client';

describe('Create Todo', () => {
  beforeEach(() => {
    return clearDatabase();
  });

  authTest('should create a todo successfully', async ({ auth: { client } }) => {
    const before = new Date();
    const todo = await client.todo.create({ title: 'title', description: 'description' });
    expect(todo.description).to.be.equal('description');
    expect(todo.title).to.be.equal('title');
    expect(todo.completed).to.be.false;
    expect(todo.createdAt).to.be.greaterThanOrEqual(before);
    expect(todo.updatedAt).to.be.greaterThanOrEqual(before);
    const todoDb = await Database.selectFrom('todos').selectAll().where('id', '=', todo.id).executeTakeFirstOrThrow();
    expect(todoDb).toMatchObject(todo);
  });

  checkAuthenticatedRoute('todo', 'create');

  authTest('should error: empty title', async ({ auth: { client } }) => {
    await assertValidationError(
      client.todo.create({ title: '', description: 'description' }),
      'String must contain at least 1 character(s)',
    );
  });
});
