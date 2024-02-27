/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `ApiCredential` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[githubUsername]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `ApiCredential` table without a default value. This is not possible if the table is not empty.
  - Added the required column `githubUsername` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "ApiCredential" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CoverageSnapshot" ADD COLUMN     "branch" TEXT,
ALTER COLUMN "result" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "githubToken" TEXT,
ADD COLUMN     "githubUsername" TEXT NOT NULL,
ADD COLUMN     "role" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ApiCredential_userId_key" ON "ApiCredential"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_githubUsername_key" ON "User"("githubUsername");

-- AddForeignKey
ALTER TABLE "ApiCredential" ADD CONSTRAINT "ApiCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
