/*
  Warnings:

  - You are about to drop the column `statusId` on the `Tasks` table. All the data in the column will be lost.
  - Added the required column `taskStatusId` to the `Tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Tasks` DROP FOREIGN KEY `Tasks_statusId_fkey`;

-- AlterTable
ALTER TABLE `Tasks` DROP COLUMN `statusId`,
    ADD COLUMN `taskStatusId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Tasks` ADD CONSTRAINT `Tasks_taskStatusId_fkey` FOREIGN KEY (`taskStatusId`) REFERENCES `TasksStatus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
