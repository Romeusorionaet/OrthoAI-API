import { QuizQuestion } from "@/domain/essay-corrector/enterprise/entities/quiz-questions";
import { Prisma, QuizQuestions as PrismaQuizQuestions } from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export class PrismaQuizQuestionsMapper {
  static toDomain(raw: PrismaQuizQuestions): QuizQuestion {
    return QuizQuestion.create(
      {
        documentContentId: new UniqueEntityID(raw.document_content_id),
        quiz: raw.quiz,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    quizQuestion: QuizQuestion,
  ): Prisma.QuizQuestionsUncheckedCreateInput {
    return {
      id: quizQuestion.id.toString(),
      document_content_id: quizQuestion.documentContentId.toString(),
      quiz: quizQuestion.quiz,
    };
  }
}
