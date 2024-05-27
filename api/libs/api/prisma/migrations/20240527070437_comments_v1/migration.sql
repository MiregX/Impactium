/*
  Warnings:

  - You are about to drop the column `stat` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "stat";
ALTER TABLE "Comment" ADD COLUMN     "likes" INT4 NOT NULL DEFAULT 0;
ALTER TABLE "Comment" ADD COLUMN     "teamIndent" STRING;
ALTER TABLE "Comment" ADD COLUMN     "tournamentIndent" STRING;

-- CreateIndex
CREATE INDEX "teamIndent" ON "Comment"("teamIndent");

-- CreateIndex
CREATE INDEX "tournamentIndent" ON "Comment"("tournamentIndent");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_teamIndent_fkey" FOREIGN KEY ("teamIndent") REFERENCES "Team"("indent") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_tournamentIndent_fkey" FOREIGN KEY ("tournamentIndent") REFERENCES "Tournament"("code") ON DELETE SET NULL ON UPDATE CASCADE;
