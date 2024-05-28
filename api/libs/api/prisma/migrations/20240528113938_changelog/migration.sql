-- CreateTable
CREATE TABLE "Changelog" (
    "id" STRING NOT NULL,
    "on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "new" STRING NOT NULL,

    CONSTRAINT "Changelog_pkey" PRIMARY KEY ("id")
);
