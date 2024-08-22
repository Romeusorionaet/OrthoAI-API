import { DocumentContent } from "../../enterprise/entities/document-content";

export abstract class DocumentContentRepository {
  abstract create(documentContent: DocumentContent): Promise<{ id: string }>;
  abstract update(documentContent: DocumentContent): Promise<void>;
  abstract findById(id: string): Promise<DocumentContent | null>;
}
