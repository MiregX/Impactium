/*
  Warnings:

  - You are about to drop the column `roles` on the `TeamMember` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Carry', 'Mid', 'Offlane', 'SemiSupport', 'FullSupport', 'Rotation', 'Coach');

-- AlterTable
ALTER TABLE "TeamMember" DROP COLUMN "roles";
ALTER TABLE "TeamMember" ADD COLUMN     "role" "Role";

-- DropEnum
DROP TYPE "Roles";
