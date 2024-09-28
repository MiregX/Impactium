-- CreateEnum
CREATE TYPE "LoginType" AS ENUM ('discord', 'google', 'github', 'telegram', 'steam');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Carry', 'Mid', 'Offlane', 'SemiSupport', 'FullSupport', 'Rotation', 'Coach');

-- CreateEnum
CREATE TYPE "Joinable" AS ENUM ('Free', 'Invites', 'Closed');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('success', 'pending', 'canceled', 'error');

-- CreateTable
CREATE TABLE "User" (
    "uid" STRING NOT NULL,
    "register" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" STRING,
    "avatar" STRING,
    "displayName" STRING,
    "username" STRING,
    "verified" BOOL NOT NULL DEFAULT false,

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

-- CreateTable
CREATE TABLE "Team" (
    "indent" STRING NOT NULL,
    "logo" STRING,
    "title" STRING,
    "description" STRING,
    "ownerId" STRING NOT NULL,
    "registered" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "joinable" "Joinable" NOT NULL DEFAULT 'Free',

    CONSTRAINT "Team_pkey" PRIMARY KEY ("indent")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" STRING NOT NULL,
    "uid" STRING NOT NULL,
    "indent" STRING NOT NULL,
    "role" "Role",

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "cid" STRING NOT NULL,
    "uid" STRING NOT NULL,
    "content" STRING NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "likes" INT4 NOT NULL DEFAULT 0,
    "teamIndent" STRING,
    "tournamentIndent" STRING,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("cid")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" STRING NOT NULL,
    "banner" STRING NOT NULL,
    "title" STRING NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "description" JSONB NOT NULL,
    "code" STRING NOT NULL,
    "rules" JSONB NOT NULL,
    "ownerId" STRING NOT NULL,
    "gid" STRING NOT NULL,
    "live" STRING,
    "prize" INT4 NOT NULL DEFAULT 0,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grid" (
    "id" STRING NOT NULL,
    "tid" STRING NOT NULL,
    "max" INT4,

    CONSTRAINT "Grid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Battle" (
    "id" STRING NOT NULL,
    "gid" STRING NOT NULL,
    "iteration" INT4 NOT NULL,
    "slot1" STRING,
    "slot2" STRING,
    "winner" STRING,
    "start" TIMESTAMP(3),
    "end" TIMESTAMP(3),

    CONSTRAINT "Battle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" STRING NOT NULL,
    "uid" STRING NOT NULL,
    "coins" INT4 NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "TransactionStatus" NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Changelog" (
    "id" STRING NOT NULL,
    "on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "new" STRING NOT NULL,

    CONSTRAINT "Changelog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamInvite" (
    "id" STRING NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "indent" STRING NOT NULL,
    "used" INT4 NOT NULL DEFAULT 0,
    "maxUses" INT4 NOT NULL DEFAULT 4,
    "declines" INT4 NOT NULL DEFAULT 0,

    CONSTRAINT "TeamInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TeamToTournament" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Team_indent_key" ON "Team"("indent");

-- CreateIndex
CREATE INDEX "teamIndent" ON "Comment"("teamIndent");

-- CreateIndex
CREATE INDEX "tournamentIndent" ON "Comment"("tournamentIndent");

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_code_key" ON "Tournament"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Grid_tid_key" ON "Grid"("tid");

-- CreateIndex
CREATE UNIQUE INDEX "_TeamToTournament_AB_unique" ON "_TeamToTournament"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamToTournament_B_index" ON "_TeamToTournament"("B");

-- AddForeignKey
ALTER TABLE "Login" ADD CONSTRAINT "Login_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_indent_fkey" FOREIGN KEY ("indent") REFERENCES "Team"("indent") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_teamIndent_fkey" FOREIGN KEY ("teamIndent") REFERENCES "Team"("indent") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_tournamentIndent_fkey" FOREIGN KEY ("tournamentIndent") REFERENCES "Tournament"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grid" ADD CONSTRAINT "Grid_tid_fkey" FOREIGN KEY ("tid") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_gid_fkey" FOREIGN KEY ("gid") REFERENCES "Grid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInvite" ADD CONSTRAINT "TeamInvite_indent_fkey" FOREIGN KEY ("indent") REFERENCES "Team"("indent") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToTournament" ADD CONSTRAINT "_TeamToTournament_A_fkey" FOREIGN KEY ("A") REFERENCES "Team"("indent") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToTournament" ADD CONSTRAINT "_TeamToTournament_B_fkey" FOREIGN KEY ("B") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;
