/*
  Warnings:

  - A unique constraint covering the columns `[projectId,filePath]` on the table `FileSnapshot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FileSnapshot_projectId_filePath_key" ON "FileSnapshot"("projectId", "filePath");
