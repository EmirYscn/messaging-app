/*
  Warnings:

  - Changed the type of `type` on the `Chat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CHAT_TYPE" AS ENUM ('GROUP', 'PRIVATE');

-- CreateEnum
CREATE TYPE "MESSAGE_STATUS" AS ENUM ('SENT', 'DELIVERED', 'READ');

-- CreateEnum
CREATE TYPE "MESSAGE_TYPE" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO');

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "type",
ADD COLUMN     "type" "CHAT_TYPE" NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "type" "MESSAGE_TYPE" NOT NULL DEFAULT 'TEXT';
