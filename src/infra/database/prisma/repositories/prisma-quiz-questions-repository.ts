import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";
import { QuizQuestionRepository } from "@/domain/essay-corrector/application/repositories/quiz-question-repository";
import { QuizQuestion } from "@/domain/essay-corrector/enterprise/entities/quiz-questions";
import { PrismaQuizQuestionsMapper } from "../mappers/prisma-quiz-questions-mapper";

@Injectable()
export class PrismaQuizQuestionsRepository implements QuizQuestionRepository {
  constructor(private prisma: PrismaService) {}

  async create(quizQuestion: QuizQuestion): Promise<void> {
    const data = PrismaQuizQuestionsMapper.toPrisma(quizQuestion);

    await this.prisma.quizQuestions.create({
      data,
    });
  }

  async findByDocumentId(documentId: string): Promise<QuizQuestion | null> {
    const result = await this.prisma.quizQuestions.findFirst({
      where: { document_content_id: documentId },
    });

    if (!result) {
      return null;
    }

    const quizQuestion = PrismaQuizQuestionsMapper.toDomain(result);

    return quizQuestion;
  }
}
