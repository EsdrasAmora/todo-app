import { beforeEach, expect, describe, it } from 'vitest';
import { DbClient } from '../db/client';
import { assertThrows, assertValidationError, isDefined } from './assert-helpers';
import { clearDatabase } from './clear-db';
import { createCaller, createTodo, createUser } from './test-client';
import { checkAuthenticatedRoute } from './auth-check';
import { eq } from 'drizzle-orm';
import { TodoEntity, UserEntity } from '../db/schema';

describe('Update Todo', () => {
  beforeEach(() => {
    return clearDatabase();
  });

  it('should update a todo successfully', async () => {
    const { id: userId } = await createUser();
    const client = createCaller(userId);
    const dbTodo = await createTodo(userId);

    const todo = await client.todo.update({
      todoId: dbTodo.id,
      title: 'title',
      description: 'description',
      completed: true,
    });

    expect(todo.id).to.be.equal(dbTodo.id);
    expect(todo.description).to.be.equal('description');
    expect(todo.title).to.be.equal('title');
    expect(todo.completed).to.be.true;
    expect(todo.createdAt.getTime()).to.be.eq(dbTodo.createdAt.getTime());
    expect(todo.updatedAt).to.be.greaterThan(dbTodo.updatedAt).and.to.be.greaterThan(todo.createdAt);

    const todoDb = await DbClient.query.TodoEntity.findFirst({ where: eq(TodoEntity.id, todo.id) });
    expect(todoDb).toMatchObject(todo);
  });

  checkAuthenticatedRoute('todo', 'findUserTodos');

  it('should error: user should be only able to update its own todos', async () => {
    const [val] = await DbClient.insert(UserEntity)
      .values({ passwordSeed: 'a', email: 'a', hashedPassword: 'a' })
      .returning();

    isDefined(val);
    const [otherUserTodo] = await DbClient.insert(TodoEntity).values({ userId: val.id, title: 'e' }).returning();
    const { id: userId } = await createUser();
    const client = createCaller(userId);
    isDefined(otherUserTodo);
    await assertThrows(client.todo.update({ todoId: otherUserTodo.id }), 'Resource not found');
  });

  it('should error: already deleted todo', async () => {
    const { id: userId } = await createUser();
    const client = createCaller(userId);
    const dbTodo = await createTodo(userId);

    await DbClient.update(TodoEntity).set({ deletedAt: new Date() }).where(eq(TodoEntity.id, dbTodo.id)).execute();

    await assertThrows(client.todo.delete({ todoId: dbTodo.id }), 'Resource not found');
  });

  it('should error: invalid uuid', async () => {
    const { id: userId } = await createUser();
    const client = createCaller(userId);

    await assertValidationError(client.todo.delete({ todoId: '123' }), 'Invalid uuid');
  });

  it('should error: empty title', async () => {
    const { id: userId } = await createUser();
    const client = createCaller(userId);
    const dbTodo = await createTodo(userId);
    await assertValidationError(
      client.todo.update({ todoId: dbTodo.id, title: '' }),
      'String must contain at least 1 character(s)',
    );
  });
});
