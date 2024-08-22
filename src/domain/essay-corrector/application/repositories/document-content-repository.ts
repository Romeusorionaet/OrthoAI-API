import { DocumentContent } from "../../enterprise/entities/document-content";

export abstract class DocumentContentRepository {
  abstract create(documentContent: DocumentContent): Promise<{ id: string }>;
}
