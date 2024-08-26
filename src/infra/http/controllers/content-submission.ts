import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from "@nestjs/common";
import { SendRulesAndQuestionsForContentUseCase } from "@/domain/essay-corrector/application/use-case/send-rules-and-questions-for-content";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { DocumentNotFoundError } from "@/domain/essay-corrector/application/use-case/errors/document-not-found-error";
import { CompletionNotPossibleError } from "@/domain/essay-corrector/application/use-case/errors/completion-not-possible-error";

const contentSubmissionBodySchema = z.object({
  id: z.string().uuid(),
  rules: z.array(z.string()),
  questions: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(contentSubmissionBodySchema);

type ContentSubmissionBodySchema = z.infer<typeof contentSubmissionBodySchema>;

@Controller("/submit-content")
export class ContentSubmissionController {
  constructor(
    // TODO change name of use case
    private sendRulesAndQuestionsForContentUseCase: SendRulesAndQuestionsForContentUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe)
    body: ContentSubmissionBodySchema,
  ): Promise<{ message: string }> {
    const { id, rules, questions } = body;

    const result = await this.sendRulesAndQuestionsForContentUseCase.execute({
      id,
      rules: JSON.stringify(rules),
      questions,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case DocumentNotFoundError:
        case CompletionNotPossibleError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return { message: "success" };
  }
}
