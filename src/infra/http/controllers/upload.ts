import {
  BadRequestException,
  Controller,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { SaveDocumentContentUseCase } from "@/domain/essay-corrector/application/use-case/save-document-content";
import { ContentCouldNotExtractError } from "@/domain/essay-corrector/application/use-case/errors/content-could-not-extract-error";

@Controller("/upload-file")
export class UploadController {
  constructor(private saveDocumentContentUseCase: SaveDocumentContentUseCase) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor("file"))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2mb
        ],
      }),
    )
    file: any,
  ): Promise<{ documentContentId: string | BadRequestException }> {
    const allowedMimeTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException("Tipo de arquivo não permitido.");
    }

    if (!file) {
      throw new BadRequestException("Nenhum arquivo foi enviado.");
    }

    const fileBuffer = file.buffer;
    const mimetype = file.mimetype;

    const result = await this.saveDocumentContentUseCase.execute({
      fileBuffer,
      mimetype,
    });

    if (result.isLeft()) {
      const err = result.value;

      switch (err.constructor) {
        case ContentCouldNotExtractError:
          throw new BadRequestException(err.message);
        default:
          throw new BadRequestException(err.message);
      }
    }

    if (!result.value) {
      throw new BadRequestException();
    }

    const documentContentId = result.value.id.toString();

    return {
      documentContentId,
    };
  }
}
