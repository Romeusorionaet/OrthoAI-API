/*
  Warnings:

  - You are about to drop the column `redaction_id` on the `quiz_questions` table. All the data in the column will be lost.
  - You are about to drop the `redactions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `document_content_id` to the `quiz_questions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `quiz_questions` DROP FOREIGN KEY `quiz_questions_redaction_id_fkey`;

-- AlterTable
ALTER TABLE `quiz_questions` DROP COLUMN `redaction_id`,
    ADD COLUMN `document_content_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `redactions`;

-- CreateTable
CREATE TABLE `document_content` (
    `id` VARCHAR(191) NOT NULL,
    `original_document` TEXT NOT NULL,
    `new_document` TEXT NULL,
    `roles` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `document_content_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `quiz_questions` ADD CONSTRAINT `quiz_questions_document_content_id_fkey` FOREIGN KEY (`document_content_id`) REFERENCES `document_content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
