import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  DocumentContent,
  DocumentContentProps,
} from "@/domain/essay-corrector/enterprise/entities/document-content";
import { faker } from "@faker-js/faker";

export function makeDocumentContent(
  override: Partial<DocumentContentProps> = {},
  id?: UniqueEntityID,
) {
  const documentContent = DocumentContent.create(
    {
      originalDocument: faker.lorem.sentence(),
      newDocument: "",
      rules: "",
      createdAt: new Date(),
      ...override,
    },
    id,
  );

  return documentContent;
}
