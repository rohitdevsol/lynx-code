/*
  Warnings:

  - You are about to drop the column `slug` on the `project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `project` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "project_slug_idx";

-- DropIndex
DROP INDEX "project_slug_key";

-- AlterTable
ALTER TABLE "project" DROP COLUMN "slug",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "project_name_key" ON "project"("name");

-- CreateIndex
CREATE INDEX "project_name_idx" ON "project"("name");
