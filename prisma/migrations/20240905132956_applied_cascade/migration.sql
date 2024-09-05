-- DropForeignKey
ALTER TABLE `quiz_questions` DROP FOREIGN KEY `quiz_questions_document_content_id_fkey`;

-- AddForeignKey
ALTER TABLE `quiz_questions` ADD CONSTRAINT `quiz_questions_document_content_id_fkey` FOREIGN KEY (`document_content_id`) REFERENCES `document_content`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
