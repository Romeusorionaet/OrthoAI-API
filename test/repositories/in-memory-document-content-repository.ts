import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  DocumentContentRepository,
  ResponseFetchDocumentsProps,
} from "@/domain/essay-corrector/application/repositories/document-content-repository";
import { DocumentContent } from "@/domain/essay-corrector/enterprise/entities/document-content";

export class InMemoryDocumentContentRepository
  implements DocumentContentRepository
{
  public items: DocumentContent[] = [];

  async create(
    documentContent: DocumentContent,
  ): Promise<{ id: UniqueEntityID }> {
    this.items.push(documentContent);

    return { id: documentContent.id };
  }

  async update(documentContent: DocumentContent): Promise<void> {
    const existingDocument = this.items.find(
      (item) => item.id === documentContent.id,
    );

    if (existingDocument) {
      Object.assign(existingDocument, documentContent);
    }
  }

  async findById(id: string): Promise<DocumentContent | null> {
    const documentContent = this.items.find(
      (item) => item.id.toString() === id,
    );

    if (!documentContent) {
      return null;
    }

    return documentContent;
  }

  async findMany(): Promise<ResponseFetchDocumentsProps[]> {
    const documentsContent = this.items.map((item) => {
      return {
        id: item.id,
        createdAt: item.createdAt,
        rules: item.rules,
        evaluation: item.evaluation,
      };
    });

    return documentsContent;
  }
}
