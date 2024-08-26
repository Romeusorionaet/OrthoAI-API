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
    file: Express.Multer.File,
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

    if (!result.value) {
      throw new BadRequestException();
    }

    const documentContentId = result.value.id.toString();

    return {
      documentContentId,
    };
  }
}
