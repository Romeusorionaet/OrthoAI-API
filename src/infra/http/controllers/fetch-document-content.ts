import { Controller, Get, HttpCode } from "@nestjs/common";
import { FetchDocumentContentUseCase } from "@/domain/essay-corrector/application/use-case/fetch-document-content";
import { ResponseFetchDocumentsProps } from "@/domain/essay-corrector/application/repositories/document-content-repository";

@Controller("/documents-content")
export class FetchDocumentContentController {
  constructor(
    private fetchDocumentContentUseCase: FetchDocumentContentUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(): Promise<ResponseFetchDocumentsProps[] | []> {
    const result = await this.fetchDocumentContentUseCase.execute();

    if (!result.value) {
      return [];
    }

    return result.value.documentsContent;
  }
}
