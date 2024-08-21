import { Injectable } from "@nestjs/common";
import { Either, right } from "@/core/either";
import { DocumentContent } from "../../enterprise/entities/document-content";
import { DocumentContentRepository } from "../repositories/document-content-repository";

interface SaveOriginalRedactionUseCaseRequest {
  originalDocument: string;
  roles: string;
}

type SaveOriginalRedactionUseCaseResponse = Either<null, { id: string }>;

@Injectable()
export class SaveOriginalRedactionUseCase {
  constructor(private documentContentRepository: DocumentContentRepository) {}

  async execute({
    originalDocument,
    roles,
  }: SaveOriginalRedactionUseCaseRequest): Promise<SaveOriginalRedactionUseCaseResponse> {
    const redaction = DocumentContent.create({
      originalDocument,
      roles,
    });

    const { id } = await this.documentContentRepository.create(redaction);

    return right({ id });
  }
}
