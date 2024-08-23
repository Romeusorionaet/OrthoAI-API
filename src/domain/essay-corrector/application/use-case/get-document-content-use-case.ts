import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { DocumentContentRepository } from "../repositories/document-content-repository";
import { DocumentNotFoundError } from "./errors/document-not-found-error";
import { QuizQuestionRepository } from "../repositories/quiz-question-repository";
import { DocumentContent } from "../../enterprise/entities/document-content";
import { QuizQuestion } from "../../enterprise/entities/quiz-questions";

interface GetDocumentContentUseCaseRequest {
  documentId: string;
}

type GetDocumentContentUseCaseResponse = Either<
  DocumentNotFoundError,
  { documentContent: DocumentContent; quizQuestion: QuizQuestion | null } | null
>;

@Injectable()
export class GetDocumentContentUseCase {
  constructor(
    private documentContentRepository: DocumentContentRepository,
    private quizQuestionRepository: QuizQuestionRepository,
  ) {}

  async execute({
    documentId,
  }: GetDocumentContentUseCaseRequest): Promise<GetDocumentContentUseCaseResponse> {
    const documentContent =
      await this.documentContentRepository.findById(documentId);

    if (!documentContent) {
      return left(new DocumentNotFoundError());
    }

    const quizQuestion =
      await this.quizQuestionRepository.findByDocumentId(documentId);

    return right({ documentContent, quizQuestion });
  }
}
