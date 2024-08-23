import { DocumentContent } from "@/domain/essay-corrector/enterprise/entities/document-content";
import {
  Prisma,
  DocumentContent as PrismaDocumentContent,
} from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export class PrismaDocumentContentMapper {
  static toDomain(raw: PrismaDocumentContent): DocumentContent {
    return DocumentContent.create(
      {
        originalDocument: raw.original_document,
        newDocument: raw.new_document,
        evaluation: raw.evaluation,
        rules: raw.rules,
        comment: raw.comment,
        createdAt: raw.created_at,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    documentContent: DocumentContent,
  ): Prisma.DocumentContentUncheckedCreateInput {
    return {
      id: documentContent.id.toString(),
      original_document: documentContent.originalDocument,
      new_document: documentContent.newDocument,
      rules: documentContent.rules,
      comment: documentContent.comment,
      evaluation: documentContent.evaluation,
    };
  }
}
