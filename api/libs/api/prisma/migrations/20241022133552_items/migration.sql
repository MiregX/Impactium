-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Skin', 'Ticket', 'Resourse', 'Collection');

-- CreateEnum
CREATE TYPE "Rare" AS ENUM ('Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Ancient', 'Divine');

-- CreateTable
CREATE TABLE "Item" (
    "id" STRING NOT NULL,
    "uid" STRING NOT NULL,
    "imprint" STRING NOT NULL,
    "amount" INT4 NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blueprint" (
    "imprint" STRING NOT NULL,
    "rare" "Rare" NOT NULL,
    "category" "Category" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Blueprint_imprint_key" ON "Blueprint"("imprint");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_imprint_fkey" FOREIGN KEY ("imprint") REFERENCES "Blueprint"("imprint") ON DELETE RESTRICT ON UPDATE CASCADE;
