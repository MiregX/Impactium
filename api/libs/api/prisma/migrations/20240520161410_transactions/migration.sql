-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('success', 'pending', 'canceled', 'error');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" STRING NOT NULL,
    "uid" STRING NOT NULL,
    "coins" INT4 NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "TransactionStatus" NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
