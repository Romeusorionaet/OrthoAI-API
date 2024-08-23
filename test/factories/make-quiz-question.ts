import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  QuizQuestion,
  QuizQuestionProps,
} from "@/domain/essay-corrector/enterprise/entities/quiz-questions";

export function makeQuizQuestion(
  override: Partial<QuizQuestionProps> = {},
  id?: UniqueEntityID,
) {
  const quizQuestion = QuizQuestion.create(
    {
      documentContentId: new UniqueEntityID(),
      quiz: "question-01, question-02, question-03",
      ...override,
    },
    id,
  );

  return quizQuestion;
}
