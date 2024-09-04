import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DocumentContent } from "../../enterprise/entities/document-content";

export interface ResponseFetchDocumentsProps {
  id: UniqueEntityID;
  createdAt: Date | null;
  rules?: string | null;
  evaluation?: string | null;
}

export abstract class DocumentContentRepository {
  abstract create(
    documentContent: DocumentContent,
  ): Promise<{ id: UniqueEntityID }>;

  abstract update(documentContent: DocumentContent): Promise<void>;
  abstract findById(id: string): Promise<DocumentContent | null>;
  abstract findMany(): Promise<ResponseFetchDocumentsProps[]>;
}
