/*
  Warnings:

  - You are about to drop the column `gridId` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `round` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `rounds` on the `Grid` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentId` on the `Grid` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tid]` on the table `Grid` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gid` to the `Battle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iteration` to the `Battle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tid` to the `Grid` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Battle" DROP CONSTRAINT "Battle_gridId_fkey";

-- DropForeignKey
ALTER TABLE "Grid" DROP CONSTRAINT "Grid_tournamentId_fkey";

-- DropIndex
DROP INDEX "Grid_tournamentId_key";

-- AlterTable
ALTER TABLE "Battle" DROP COLUMN "gridId";
ALTER TABLE "Battle" DROP COLUMN "round";
ALTER TABLE "Battle" ADD COLUMN     "gid" STRING NOT NULL;
ALTER TABLE "Battle" ADD COLUMN     "iteration" INT4 NOT NULL;

-- AlterTable
ALTER TABLE "Grid" DROP COLUMN "rounds";
ALTER TABLE "Grid" DROP COLUMN "tournamentId";
ALTER TABLE "Grid" ADD COLUMN     "max" INT4;
ALTER TABLE "Grid" ADD COLUMN     "tid" STRING NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Grid_tid_key" ON "Grid"("tid");

-- AddForeignKey
ALTER TABLE "Grid" ADD CONSTRAINT "Grid_tid_fkey" FOREIGN KEY ("tid") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_gid_fkey" FOREIGN KEY ("gid") REFERENCES "Grid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
