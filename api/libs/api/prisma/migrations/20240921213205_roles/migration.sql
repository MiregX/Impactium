/*
  Warnings:

  - The values [owner,carry,mid,offlane,semisupport,fullsupport,rotation,coach,fix] on the enum `Roles` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "Roles" ADD VALUE 'Carry';
ALTER TYPE "Roles" ADD VALUE 'Mid';
ALTER TYPE "Roles" ADD VALUE 'Offlane';
ALTER TYPE "Roles" ADD VALUE 'SemiSupport';
ALTER TYPE "Roles" ADD VALUE 'FullSupport';
ALTER TYPE "Roles" ADD VALUE 'Rotation';
ALTER TYPE "Roles" ADD VALUE 'Coach';
ALTER TYPE "Roles"DROP VALUE 'owner';
ALTER TYPE "Roles"DROP VALUE 'carry';
ALTER TYPE "Roles"DROP VALUE 'mid';
ALTER TYPE "Roles"DROP VALUE 'offlane';
ALTER TYPE "Roles"DROP VALUE 'semisupport';
ALTER TYPE "Roles"DROP VALUE 'fullsupport';
ALTER TYPE "Roles"DROP VALUE 'rotation';
ALTER TYPE "Roles"DROP VALUE 'coach';
ALTER TYPE "Roles"DROP VALUE 'fix';
