/*
  Warnings:

  - You are about to drop the column `winner` on the `Battle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Battle" DROP COLUMN "winner";
ALTER TABLE "Battle" ADD COLUMN     "is_slot_one_winner" BOOL;
