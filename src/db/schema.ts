import { boolean, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
// import { sql } from 'drizzle-orm';

export const users = pgTable(
  'users',
  {
    userId: uuid('user_id').defaultRandom().primaryKey().notNull(),
    createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' }).notNull(),
    email: text('email').notNull(),
    passwordSeed: text('password_seed').notNull(),
    hashedPassword: text('hashed_password').notNull(),
  },
  (table) => {
    return {
      emailKey: uniqueIndex('users_email_key').on(table.email),
    };
  },
);

export const todos = pgTable('todos', {
  todoId: uuid('todo_id').defaultRandom().primaryKey().notNull(),
  createdAt: timestamp('created_at', { precision: 3, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { precision: 3, mode: 'string' }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  completed: boolean('completed').default(false).notNull(),
  deletedAt: timestamp('deleted_at', { precision: 3, mode: 'string' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.userId, { onDelete: 'restrict', onUpdate: 'cascade' }),
});
