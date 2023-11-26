import { boolean, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

export const UserEntity = pgTable(
  'users',
  {
    id: uuid('user_id').defaultRandom().primaryKey().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, precision: 6, mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, precision: 6, mode: 'date' }).defaultNow().notNull(),
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

export const TodoEntity = pgTable('todos', {
  id: uuid('todo_id').defaultRandom().primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, precision: 6, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, precision: 6, mode: 'date' }).defaultNow().notNull(),
  title: text('title').notNull(),
  description: text('description'),
  completed: boolean('completed').default(false).notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true, precision: 6, mode: 'date' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => UserEntity.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
});
