import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { DocumentNotFoundError } from "@/domain/essay-corrector/application/use-case/errors/document-not-found-error";
import { CompletionNotPossibleError } from "@/domain/essay-corrector/application/use-case/errors/completion-not-possible-error";
import { ContentSubmissionUseCase } from "@/domain/essay-corrector/application/use-case/content-submission";

const contentSubmissionBodySchema = z.object({
  id: z.string().uuid(),
  rules: z.array(z.string()),
  questions: z.array(z.string()),
});

const bodyValidationPipe = new ZodValidationPipe(contentSubmissionBodySchema);

type ContentSubmissionBodySchema = z.infer<typeof contentSubmissionBodySchema>;

@Controller("/submit-content")
export class ContentSubmissionController {
  constructor(private contentSubmissionUseCase: ContentSubmissionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe)
    body: ContentSubmissionBodySchema,
  ): Promise<{ message: string }> {
    const { id, rules, questions } = body;

    const result = await this.contentSubmissionUseCase.execute({
      id,
      rules: JSON.stringify(rules),
      questions: JSON.stringify(questions),
    });

    if (result.isLeft()) {
      const err = result.value;

      switch (err.constructor) {
        case DocumentNotFoundError:
        case CompletionNotPossibleError:
          throw new BadRequestException(err.message);
        default:
          throw new BadRequestException(err.message);
      }
    }

    return { message: "success" };
  }
}
