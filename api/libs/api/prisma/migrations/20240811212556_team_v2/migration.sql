/*
  Warnings:

  - You are about to drop the column `membersAmount` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "membersAmount";
ALTER TABLE "Team" ADD COLUMN     "registered" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
