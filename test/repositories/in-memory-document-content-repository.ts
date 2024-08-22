import { DocumentContentRepository } from "@/domain/essay-corrector/application/repositories/document-content-repository";
import { DocumentContent } from "@/domain/essay-corrector/enterprise/entities/document-content";

export class InMemoryDocumentContentRepository
  implements DocumentContentRepository
{
  public items: DocumentContent[] = [];

  async create(documentContent: DocumentContent): Promise<{ id: string }> {
    this.items.push(documentContent);

    return { id: documentContent.id.toString() };
  }
}
