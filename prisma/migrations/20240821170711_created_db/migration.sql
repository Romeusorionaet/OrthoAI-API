-- CreateTable
CREATE TABLE `redactions` (
    `id` VARCHAR(191) NOT NULL,
    `old_redaction` TEXT NOT NULL,
    `new_redaction` TEXT NOT NULL,
    `roles` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `redactions_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_questions` (
    `id` VARCHAR(191) NOT NULL,
    `quiz` TEXT NOT NULL,
    `redaction_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `quiz_questions_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `quiz_questions` ADD CONSTRAINT `quiz_questions_redaction_id_fkey` FOREIGN KEY (`redaction_id`) REFERENCES `redactions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
