/*
  Warnings:

  - The primary key for the `todos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `completed_at` on the `todos` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `todos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "todos" DROP CONSTRAINT "todos_pkey",
DROP COLUMN "completed_at",
DROP COLUMN "id",
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "todo_id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "todos_pkey" PRIMARY KEY ("todo_id");
