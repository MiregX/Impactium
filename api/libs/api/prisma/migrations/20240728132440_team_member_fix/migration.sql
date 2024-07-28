/*
  Warnings:

  - You are about to drop the column `username` on the `Login` table. All the data in the column will be lost.
  - You are about to drop the `TeamMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TeamMembers" DROP CONSTRAINT "TeamMembers_tid_fkey";

-- DropForeignKey
ALTER TABLE "TeamMembers" DROP CONSTRAINT "TeamMembers_uid_fkey";

-- DropIndex
DROP INDEX "Login_username_key";

-- AlterTable
ALTER TABLE "Login" DROP COLUMN "username";

-- DropTable
DROP TABLE "TeamMembers";

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" STRING NOT NULL,
    "uid" STRING NOT NULL,
    "tid" STRING NOT NULL,
    "roles" "Roles"[],

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_tid_fkey" FOREIGN KEY ("tid") REFERENCES "Team"("indent") ON DELETE RESTRICT ON UPDATE CASCADE;
