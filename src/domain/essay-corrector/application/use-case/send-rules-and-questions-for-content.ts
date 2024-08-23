import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { DocumentContentRepository } from "../repositories/document-content-repository";
import { DocumentNotFoundError } from "./errors/document-not-found-error";
import { TextGenerationServiceRepository } from "../text-generation-service/text-generation-service-repository";

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
  constructor(
    private documentContentRepository: DocumentContentRepository,
    private textGenerationServiceRepository: TextGenerationServiceRepository,
  ) {}

  async execute({
    id,
    rules,
    questions,
  }: SendRulesAndQuestionsForContentUseCaseRequest): Promise<SendRulesAndQuestionsForContentUseCaseResponse> {
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

    console.log(resultCompletion, "====resultCompletion====");

    if (!resultCompletion) {
      // TODO create a error for this situation
      return left(new DocumentNotFoundError());
    }

    const updatedDocument = documentContent.update({
      rules,
      newDocument: resultCompletion.correctedContent,
      evaluation: resultCompletion.evaluation,
    });

    await this.documentContentRepository.update(updatedDocument);

    return right({});
  }
}
