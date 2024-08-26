import { Module } from "@nestjs/common";
import { PrismaDocumentContentRepository } from "./prisma/repositories/prisma-document-content-repository";
import { DocumentContentRepository } from "@/domain/essay-corrector/application/repositories/document-content-repository";
import { PrismaService } from "./prisma/prisma.service";
import { QuizQuestionRepository } from "@/domain/essay-corrector/application/repositories/quiz-question-repository";
import { PrismaQuizQuestionsRepository } from "./prisma/repositories/prisma-quiz-questions-repository";

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: DocumentContentRepository,
      useClass: PrismaDocumentContentRepository,
    },
    {
      provide: QuizQuestionRepository,
      useClass: PrismaQuizQuestionsRepository,
    },
  ],
  exports: [PrismaService, DocumentContentRepository, QuizQuestionRepository],
})
export class DatabaseModule {}
