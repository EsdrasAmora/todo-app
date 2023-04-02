import { expect } from 'chai';
import { clearDatabase } from './clear-db';
import { createCaller, createUnauthorizedCaller, createUser } from './test-client';
import { assertThrows, assertValidationError } from './assert-helpers';

describe('Create Todo', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  it('Creates sucessfully', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    const before = new Date();
    const todo = await client.todo.create({ title: 'title', description: 'description' });
    expect(todo.description).to.be.equal('description');
    expect(todo.title).to.be.equal('title');
    expect(todo.completed).to.be.false;
    expect(todo.createdAt).to.be.greaterThan(before);
    expect(todo.updatedAt).to.be.greaterThan(before);
  });

  it('Unauthorized', async () => {
    const client = createUnauthorizedCaller();
    await assertThrows(
      client.todo.create({ title: 'title', description: 'description' }),
      'Missing authorization header',
    );
  });

  it('Empty Title', async () => {
    const { id: userId } = await createUser();
    const client = await createCaller(userId);
    await assertValidationError(
      client.todo.create({ title: '', description: 'description' }),
      'String must contain at least 1 character(s)',
    );
  });
});
