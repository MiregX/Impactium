-- CreateEnum
CREATE TYPE "LoginType" AS ENUM ('discord', 'google');

-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "lastLogin" "LoginType" NOT NULL,
    "register" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" STRING,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Login" (
    "id" STRING NOT NULL,
    "type" "LoginType" NOT NULL,
    "avatar" STRING,
    "displayName" STRING NOT NULL,
    "locale" STRING NOT NULL,
    "uid" STRING NOT NULL,

    CONSTRAINT "Login_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "uid" STRING NOT NULL,
    "nickname" STRING,
    "password" STRING,
    "register" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "OldNicknames" (
    "nickname" STRING NOT NULL,
    "uid" STRING NOT NULL
);

-- CreateTable
CREATE TABLE "Skin" (
    "title" STRING NOT NULL,
    "icon" STRING NOT NULL,
    "source" STRING NOT NULL,
    "uid" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Login_uid_key" ON "Login"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Player_uid_key" ON "Player"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Player_nickname_key" ON "Player"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "OldNicknames_uid_key" ON "OldNicknames"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Skin_uid_key" ON "Skin"("uid");

-- AddForeignKey
ALTER TABLE "Login" ADD CONSTRAINT "Login_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OldNicknames" ADD CONSTRAINT "OldNicknames_uid_fkey" FOREIGN KEY ("uid") REFERENCES "Player"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skin" ADD CONSTRAINT "Skin_uid_fkey" FOREIGN KEY ("uid") REFERENCES "Player"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
