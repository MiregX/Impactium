/*
  Warnings:

  - You are about to drop the column `end` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `gid` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `iteration` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `slot1` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `slot2` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `Battle` table. All the data in the column will be lost.
  - You are about to drop the column `gid` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the `Grid` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `iid` to the `Battle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerOne` to the `Battle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerTwo` to the `Battle` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EliminationType" AS ENUM ('SINGLE', 'DOUBLE');

-- CreateEnum
CREATE TYPE "BracketType" AS ENUM ('UPPER', 'LOWER');

-- DropForeignKey
ALTER TABLE "Battle" DROP CONSTRAINT "Battle_gid_fkey";

-- DropForeignKey
ALTER TABLE "Grid" DROP CONSTRAINT "Grid_tid_fkey";

-- AlterTable
ALTER TABLE "Battle" DROP COLUMN "end";
ALTER TABLE "Battle" DROP COLUMN "gid";
ALTER TABLE "Battle" DROP COLUMN "iteration";
ALTER TABLE "Battle" DROP COLUMN "slot1";
ALTER TABLE "Battle" DROP COLUMN "slot2";
ALTER TABLE "Battle" DROP COLUMN "start";
ALTER TABLE "Battle" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Battle" ADD COLUMN     "iid" STRING NOT NULL;
ALTER TABLE "Battle" ADD COLUMN     "playerOne" STRING NOT NULL;
ALTER TABLE "Battle" ADD COLUMN     "playerTwo" STRING NOT NULL;

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "joinable" SET DEFAULT 'Invites';

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "gid";
ALTER TABLE "Tournament" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Tournament" ADD COLUMN     "eliminationType" "EliminationType" NOT NULL DEFAULT 'SINGLE';

-- DropTable
DROP TABLE "Grid";

-- CreateTable
CREATE TABLE "Iteration" (
    "id" STRING NOT NULL,
    "tid" STRING NOT NULL,
    "number" INT4 NOT NULL,
    "bracketType" "BracketType" NOT NULL,

    CONSTRAINT "Iteration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" STRING NOT NULL,
    "bid" STRING NOT NULL,
    "n" INT4 NOT NULL,
    "matchId" STRING,
    "winner" STRING,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Format" (
    "id" STRING NOT NULL,
    "tid" STRING NOT NULL,
    "n" INT4 NOT NULL,
    "format" STRING NOT NULL,

    CONSTRAINT "Format_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Iteration" ADD CONSTRAINT "Iteration_tid_fkey" FOREIGN KEY ("tid") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_iid_fkey" FOREIGN KEY ("iid") REFERENCES "Iteration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_bid_fkey" FOREIGN KEY ("bid") REFERENCES "Battle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Format" ADD CONSTRAINT "Format_tid_fkey" FOREIGN KEY ("tid") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
