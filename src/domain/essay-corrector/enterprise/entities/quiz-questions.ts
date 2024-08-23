import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface QuizQuestionProps {
  documentContentId: UniqueEntityID;
  quiz: string;
}

export class QuizQuestion extends Entity<QuizQuestionProps> {
  get quiz() {
    return this.props.quiz;
  }

  get documentContentId() {
    return this.props.documentContentId;
  }

  static create(props: QuizQuestionProps, id?: UniqueEntityID) {
    const quizQuestion = new QuizQuestion(props, id);

    return quizQuestion;
  }
}
