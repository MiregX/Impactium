-- CreateEnum
CREATE TYPE "LoginType" AS ENUM ('discord', 'google', 'github', 'telegram', 'steam');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('carry', 'mid', 'offlane', 'semisupport', 'fullsupport', 'rotation', 'coach');

-- CreateTable
CREATE TABLE "User" (
    "uid" STRING NOT NULL,
    "register" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" STRING,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Login" (
    "uid" STRING NOT NULL,
    "id" STRING NOT NULL,
    "type" "LoginType" NOT NULL,
    "on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatar" STRING,
    "displayName" STRING NOT NULL,
    "lang" STRING NOT NULL
);

-- CreateTable
CREATE TABLE "Player" (
    "uid" STRING NOT NULL,
    "steamId" STRING,
    "nickname" STRING NOT NULL,
    "role" "Roles" NOT NULL,
    "dotabuff" STRING
);

-- CreateTable
CREATE TABLE "Team" (
    "id" STRING NOT NULL,
    "banner" STRING NOT NULL,
    "title" STRING NOT NULL,
    "ownerId" STRING NOT NULL,
    "tournamentId" STRING NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" STRING NOT NULL,
    "roles" "Roles"[],
    "uid" STRING NOT NULL,
    "teamId" STRING NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Battle" (
    "id" STRING NOT NULL,
    "winnerId" STRING NOT NULL,
    "tournamentId" STRING NOT NULL,

    CONSTRAINT "Battle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BattleToTeam" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Login_id_key" ON "Login"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Player_uid_key" ON "Player"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Player_steamId_key" ON "Player"("steamId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_dotabuff_key" ON "Player"("dotabuff");

-- CreateIndex
CREATE UNIQUE INDEX "Team_title_key" ON "Team"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_code_key" ON "Tournament"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Battle_id_key" ON "Battle"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_BattleToTeam_AB_unique" ON "_BattleToTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_BattleToTeam_B_index" ON "_BattleToTeam"("B");

-- AddForeignKey
ALTER TABLE "Login" ADD CONSTRAINT "Login_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_uid_fkey" FOREIGN KEY ("uid") REFERENCES "Player"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Battle" ADD CONSTRAINT "Battle_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BattleToTeam" ADD CONSTRAINT "_BattleToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "Battle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BattleToTeam" ADD CONSTRAINT "_BattleToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
