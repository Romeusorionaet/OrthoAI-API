import { QuizQuestionRepository } from "@/domain/essay-corrector/application/repositories/quiz-question-repository";
import { QuizQuestion } from "@/domain/essay-corrector/enterprise/entities/quiz-questions";

export class InMemoryQuizQuestionRepository implements QuizQuestionRepository {
  public items: QuizQuestion[] = [];

  async create(quizQuestion: QuizQuestion): Promise<void> {
    this.items.push(quizQuestion);
  }

  async findByDocumentId(documentId: string): Promise<QuizQuestion | null> {
    const quizQuestion = this.items.find(
      (item) => item.documentContentId.toString() === documentId,
    );

    if (!quizQuestion) {
      return null;
    }

    return quizQuestion;
  }
}
