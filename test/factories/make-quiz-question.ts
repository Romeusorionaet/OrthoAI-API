import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  QuizQuestion,
  QuizQuestionProps,
} from "@/domain/essay-corrector/enterprise/entities/quiz-questions";
import { PrismaQuizQuestionsMapper } from "@/infra/database/prisma/mappers/prisma-quiz-questions-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export function makeQuizQuestion(
  override: Partial<QuizQuestionProps> = {},
  id?: UniqueEntityID,
) {
  const quizQuestion = QuizQuestion.create(
    {
      documentContentId: new UniqueEntityID(),
      quiz: "['question-01', 'question-02', 'question-03']",
      ...override,
    },
    id,
  );

  return quizQuestion;
}

@Injectable()
export class QuizQuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makeQuizQuestion(
    data: Partial<QuizQuestionProps> = {},
  ): Promise<QuizQuestion> {
    const quizQuestion = makeQuizQuestion(data);

    await this.prisma.quizQuestions.create({
      data: PrismaQuizQuestionsMapper.toPrisma(quizQuestion),
    });

    return quizQuestion;
  }
}
