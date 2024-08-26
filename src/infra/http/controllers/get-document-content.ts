import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from "@nestjs/common";
import { DocumentNotFoundError } from "@/domain/essay-corrector/application/use-case/errors/document-not-found-error";
import { GetDocumentContentUseCase } from "@/domain/essay-corrector/application/use-case/get-document-content-use-case";
import { DocumentContentPresenter } from "../presenters/document-content-presenter";
import { QuizQuestionsPresenter } from "../presenters/quiz-questions.presenter";

@Controller("/correction/:id")
export class GetDocumentContentController {
  constructor(private getDocumentContentUseCase: GetDocumentContentUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param("id") id: string): Promise<any> {
    const result = await this.getDocumentContentUseCase.execute({
      documentId: id,
    });

    if (result.isLeft()) {
      const err = result.value;

      switch (err.constructor) {
        case DocumentNotFoundError:
          throw new BadRequestException(err.message);
        default:
          throw new BadRequestException(err.message);
      }
    }

    if (!result.value) {
      throw new BadRequestException(DocumentNotFoundError);
    }

    return {
      documentContent: DocumentContentPresenter.toHTTP(
        result.value.documentContent,
      ),
      quizQuestions: result.value.quizQuestion
        ? QuizQuestionsPresenter.toHTTP(result.value.quizQuestion)
        : null,
    };
  }
}
