-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "live" STRING;
ALTER TABLE "Tournament" ADD COLUMN     "prize" INT4 NOT NULL DEFAULT 0;
