import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { DocumentContentRepository } from "../repositories/document-content-repository";
import { DocumentNotFoundError } from "./errors/document-not-found-error";
import { TextGenerationServiceRepository } from "../text-generation-service/text-generation-service-repository";
import { CompletionNotPossibleError } from "./errors/completion-not-possible-error";
import { QuizQuestionRepository } from "../repositories/quiz-question-repository";
import { QuizQuestion } from "../../enterprise/entities/quiz-questions";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface ContentSubmissionUseCaseRequest {
  id: string;
  rules: string;
  questions: string;
}

type ContentSubmissionUseCaseResponse = Either<
  DocumentNotFoundError | CompletionNotPossibleError,
  object
>;

@Injectable()
export class ContentSubmissionUseCase {
  constructor(
    private documentContentRepository: DocumentContentRepository,
    private textGenerationServiceRepository: TextGenerationServiceRepository,
    private quizQuestionRepository: QuizQuestionRepository,
  ) {}

  async execute({
    id,
    rules,
    questions,
  }: ContentSubmissionUseCaseRequest): Promise<ContentSubmissionUseCaseResponse> {
    const documentContent = await this.documentContentRepository.findById(id);

    if (!documentContent) {
      return left(new DocumentNotFoundError());
    }

    const resultCompletion =
      await this.textGenerationServiceRepository.createCompletion({
        content: documentContent.originalDocument,
        rules,
        questions,
      });

    if (!resultCompletion) {
      return left(new CompletionNotPossibleError());
    }

    const updatedDocument = documentContent.update({
      rules,
      newDocument: resultCompletion.correctedContent,
      evaluation: resultCompletion.evaluation,
      comment: resultCompletion.comment,
    });

    const quizQuestion = QuizQuestion.create({
      documentContentId: new UniqueEntityID(id),
      quiz: JSON.stringify(resultCompletion.questionVerification),
    });

    await this.documentContentRepository.update(updatedDocument);
    await this.quizQuestionRepository.create(quizQuestion);

    return right({});
  }
}
