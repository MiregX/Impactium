/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Login` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Login_id_key";

-- AlterTable
ALTER TABLE "Login" ADD COLUMN     "username" STRING;
ALTER TABLE "Login" ALTER COLUMN "displayName" DROP NOT NULL;
ALTER TABLE "Login" ADD CONSTRAINT "Login_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" STRING;

-- CreateIndex
CREATE UNIQUE INDEX "Login_username_key" ON "Login"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
