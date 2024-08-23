import { QuizQuestionRepository } from "@/domain/essay-corrector/application/repositories/quiz-question-repository";
import { QuizQuestion } from "@/domain/essay-corrector/enterprise/entities/quiz-questions";

export class InMemoryQuizQuestionRepository implements QuizQuestionRepository {
  public items: QuizQuestion[] = [];

  async create(quizQuestion: QuizQuestion): Promise<void> {
    this.items.push(quizQuestion);
  }
}
