/*
  Warnings:

  - The values [google,github] on the enum `LoginType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Changelog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `id` on the `Tournament` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "LoginType"DROP VALUE 'google';
ALTER TYPE "LoginType"DROP VALUE 'github';

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_teamIndent_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_tournamentIndent_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_uid_fkey";

-- DropForeignKey
ALTER TABLE "Iteration" DROP CONSTRAINT "Iteration_tid_fkey";

-- DropForeignKey
ALTER TABLE "_TeamToTournament" DROP CONSTRAINT "_TeamToTournament_B_fkey";

-- DropTable
DROP TABLE "Changelog";

-- DropTable
DROP TABLE "Comment";

-- RedefineTables
CREATE TABLE "_prisma_new_Tournament" (
    "banner" STRING NOT NULL,
    "title" STRING NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "description" JSONB NOT NULL,
    "code" STRING NOT NULL,
    "rules" JSONB NOT NULL,
    "ownerId" STRING NOT NULL,
    "live" STRING,
    "prize" INT4 NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "has_lower_bracket" BOOL NOT NULL DEFAULT false,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("code")
);
DROP INDEX "Tournament_code_key";
INSERT INTO "_prisma_new_Tournament" ("banner","code","createdAt","description","end","has_lower_bracket","live","ownerId","prize","rules","start","title") SELECT "banner","code","createdAt","description","end","has_lower_bracket","live","ownerId","prize","rules","start","title" FROM "Tournament";
DROP TABLE "Tournament" CASCADE;
ALTER TABLE "_prisma_new_Tournament" RENAME TO "Tournament";
CREATE UNIQUE INDEX "Tournament_code_key" ON "Tournament"("code");
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Iteration" ADD CONSTRAINT "Iteration_tid_fkey" FOREIGN KEY ("tid") REFERENCES "Tournament"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToTournament" ADD CONSTRAINT "_TeamToTournament_B_fkey" FOREIGN KEY ("B") REFERENCES "Tournament"("code") ON DELETE CASCADE ON UPDATE CASCADE;
