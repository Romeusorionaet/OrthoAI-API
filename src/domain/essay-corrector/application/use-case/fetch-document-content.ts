import { Injectable } from "@nestjs/common";
import { Either, right } from "@/core/either";
import {
  DocumentContentRepository,
  ResponseFetchDocumentsProps,
} from "../repositories/document-content-repository";

type FetchDocumentContentUseCaseResponse = Either<
  null,
  { documentsContent: ResponseFetchDocumentsProps[] }
>;

@Injectable()
export class FetchDocumentContentUseCase {
  constructor(private documentContentRepository: DocumentContentRepository) {}

  async execute(): Promise<FetchDocumentContentUseCaseResponse> {
    const documentsContent = await this.documentContentRepository.findMany();

    return right({ documentsContent });
  }
}
