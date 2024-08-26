import { QuizQuestion } from "@/domain/essay-corrector/enterprise/entities/quiz-questions";

export class QuizQuestionsPresenter {
  static toHTTP(quizQuestions: QuizQuestion) {
    return {
      quiz: quizQuestions.quiz,
    };
  }
}
