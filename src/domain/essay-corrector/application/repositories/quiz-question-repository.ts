import { QuizQuestion } from "../../enterprise/entities/quiz-questions";

export abstract class QuizQuestionRepository {
  abstract create(quizQuestion: QuizQuestion): Promise<void>;
}
