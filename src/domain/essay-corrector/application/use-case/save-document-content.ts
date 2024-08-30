import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { DocumentContentRepository } from "../repositories/document-content-repository";
import { DocumentContent } from "../../enterprise/entities/document-content";
import { ExtractContentFromFileRepository } from "../extract-content-from-file/extract-content-from-file-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ContentCouldNotExtractError } from "./errors/content-could-not-extract-error";

interface SaveDocumentContentUseCaseRequest {
  mimetype: string;
  fileBuffer: Buffer;
}

type SaveDocumentContentUseCaseResponse = Either<
  ContentCouldNotExtractError,
  { id: UniqueEntityID }
>;

@Injectable()
export class SaveDocumentContentUseCase {
  constructor(
    private documentContentRepository: DocumentContentRepository,
    private extractContentFromFileRepository: ExtractContentFromFileRepository,
  ) {}

  async execute({
    mimetype,
    fileBuffer,
  }: SaveDocumentContentUseCaseRequest): Promise<SaveDocumentContentUseCaseResponse> {
    let extractedContent = "";

    if (mimetype === "application/pdf") {
      extractedContent =
        await this.extractContentFromFileRepository.extractContentFromPDF(
          fileBuffer,
        );
    }

    if (
      mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      extractedContent =
        await this.extractContentFromFileRepository.extractContentFromDOCX(
          fileBuffer,
        );
    }

    if (
      mimetype === "image/jpeg" ||
      mimetype === "image/jpg" ||
      mimetype === "image/png"
    ) {
      extractedContent =
        await this.extractContentFromFileRepository.extractContentFromImage(
          fileBuffer,
        );
    }

    if (extractedContent === "") {
      return left(new ContentCouldNotExtractError());
    }

    const content = DocumentContent.create({
      originalDocument: extractedContent,
    });

    const { id } = await this.documentContentRepository.create(content);

    return right({ id });
  }
}
