/*
  Warnings:

  - You are about to drop the column `gid` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `winnerId` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `tid` on the `Grid` table. All the data in the column will be lost.
  - You are about to drop the column `winnerId` on the `Grid` table. All the data in the column will be lost.
  - You are about to drop the `_BattleToTeam` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tournamentId]` on the table `Grid` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gridId` to the `Battle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `round` to the `Battle` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Grid` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `rounds` to the `Grid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tournamentId` to the `Grid` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Battle" DROP CONSTRAINT "Battle_gid_fkey";

-- DropForeignKey
ALTER TABLE "Grid" DROP CONSTRAINT "Grid_tid_fkey";

-- DropForeignKey
ALTER TABLE "_BattleToTeam" DROP CONSTRAINT "_BattleToTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_BattleToTeam" DROP CONSTRAINT "_BattleToTeam_B_fkey";

-- DropIndex
DROP INDEX "Grid_tid_key";

-- AlterTable
ALTER TABLE "Battle" DROP COLUMN "gid";
ALTER TABLE "Battle" DROP COLUMN "winnerId";
ALTER TABLE "Battle" ADD COLUMN     "end" TIMESTAMP(3);
ALTER TABLE "Battle" ADD COLUMN     "gridId" STRING NOT NULL;
ALTER TABLE "Battle" ADD COLUMN     "round" INT4 NOT NULL;
ALTER TABLE "Battle" ADD COLUMN     "slot1" STRING;
ALTER TABLE "Battle" ADD COLUMN     "slot2" STRING;
ALTER TABLE "Battle" ADD COLUMN     "start" TIMESTAMP(3);
ALTER TABLE "Battle" ADD COLUMN     "winner" STRING;

-- AlterTable
ALTER TABLE "Grid" DROP COLUMN "tid";
ALTER TABLE "Grid" DROP COLUMN "winnerId";
ALTER TABLE "Grid" ADD COLUMN     "id" STRING NOT NULL;
ALTER TABLE "Grid" ADD COLUMN     "rounds" JSONB NOT NULL;
ALTER TABLE "Grid" ADD COLUMN     "tournamentId" STRING NOT NULL;
ALTER TABLE "Grid" ADD CONSTRAINT "Grid_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "_BattleToTeam";

-- CreateIndex
CREATE UNIQUE INDEX "Grid_tournamentId_key" ON "Grid"("tournamentId");

-- AddForeignKey
ALTER TABLE "Grid" ADD CONSTRAINT "Grid_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_gridId_fkey" FOREIGN KEY ("gridId") REFERENCES "Grid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
