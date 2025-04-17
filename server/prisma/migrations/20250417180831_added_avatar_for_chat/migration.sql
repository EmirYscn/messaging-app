/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "isDeleted",
ADD COLUMN     "avatar" TEXT;
