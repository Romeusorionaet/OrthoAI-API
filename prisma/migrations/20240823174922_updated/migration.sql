/*
  Warnings:

  - You are about to drop the column `roles` on the `document_content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `document_content` DROP COLUMN `roles`,
    ADD COLUMN `comment` TEXT NULL,
    ADD COLUMN `evaluation` VARCHAR(191) NULL,
    ADD COLUMN `rules` TEXT NULL;
