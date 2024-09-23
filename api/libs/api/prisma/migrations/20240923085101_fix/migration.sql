/*
  Warnings:

  - You are about to drop the `TeamInvitements` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Joinable" AS ENUM ('Free', 'Invites', 'Closed');

-- DropForeignKey
ALTER TABLE "TeamInvitements" DROP CONSTRAINT "TeamInvitements_tid_fkey";

-- DropForeignKey
ALTER TABLE "TeamInvitements" DROP CONSTRAINT "TeamInvitements_uid_fkey";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "joinable" "Joinable" NOT NULL DEFAULT 'Free';

-- DropTable
DROP TABLE "TeamInvitements";

-- CreateTable
CREATE TABLE "TeamInvite" (
    "id" STRING NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "indent" STRING NOT NULL,
    "used" INT4 NOT NULL DEFAULT 0,
    "maxUses" INT4 NOT NULL DEFAULT 4,

    CONSTRAINT "TeamInvite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeamInvite" ADD CONSTRAINT "TeamInvite_indent_fkey" FOREIGN KEY ("indent") REFERENCES "Team"("indent") ON DELETE RESTRICT ON UPDATE CASCADE;
