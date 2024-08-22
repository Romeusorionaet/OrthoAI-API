import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { DocumentContentRepository } from "../repositories/document-content-repository";
import { DocumentNotFoundError } from "./errors/document-not-found-error";

interface SendRulesAndQuestionsForContentUseCaseRequest {
  id: string;
  rules: string;
  questions: string;
}

type SendRulesAndQuestionsForContentUseCaseResponse = Either<
  DocumentNotFoundError,
  object
>;

@Injectable()
export class SendRulesAndQuestionsForContentUseCase {
  constructor(private documentContentRepository: DocumentContentRepository) {}

  async execute({
    id,
    rules,
    questions,
  }: SendRulesAndQuestionsForContentUseCaseRequest): Promise<SendRulesAndQuestionsForContentUseCaseResponse> {
    const documentContent = await this.documentContentRepository.findById(id);

    if (!documentContent) {
      return left(new DocumentNotFoundError());
    }

    const updatedDocument = documentContent.update({
      rules,
    });

    await this.documentContentRepository.update(updatedDocument);

    return right({});
  }
}
