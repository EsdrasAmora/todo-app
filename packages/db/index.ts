import type { ColumnType } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Todos {
  completed: Generated<boolean>;
  createdAt: Generated<Timestamp>;
  deletedAt: Timestamp | null;
  description: string | null;
  id: Generated<string>;
  title: string;
  updatedAt: Generated<Timestamp>;
  userId: string;
}

export interface Users {
  createdAt: Generated<Timestamp>;
  email: string;
  hashedPassword: string;
  id: Generated<string>;
  passwordSeed: string;
  updatedAt: Generated<Timestamp>;
}

export interface DB {
  todos: Todos;
  users: Users;
}
