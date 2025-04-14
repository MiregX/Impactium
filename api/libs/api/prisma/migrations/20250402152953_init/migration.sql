-- CreateEnum
CREATE TYPE "LoginType" AS ENUM ('discord', 'telegram', 'steam', 'native');

-- CreateTable
CREATE TABLE "User" (
    "uid" STRING NOT NULL,
    "registered" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" STRING,
    "avatar" STRING,
    "displayName" STRING,
    "username" STRING,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Login" (
    "uid" STRING NOT NULL,
    "id" STRING NOT NULL,
    "type" "LoginType" NOT NULL,
    "on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatar" STRING,
    "displayName" STRING,

    CONSTRAINT "Login_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Login" ADD CONSTRAINT "Login_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
