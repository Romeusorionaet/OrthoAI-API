import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  DocumentContent,
  DocumentContentProps,
} from "@/domain/essay-corrector/enterprise/entities/document-content";
import { PrismaDocumentContentMapper } from "@/infra/database/prisma/mappers/prisma-document-content-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

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

@Injectable()
export class DocumentContentFactory {
  constructor(private prisma: PrismaService) {}

  async makeDocumentContent(
    data: Partial<DocumentContentProps> = {},
  ): Promise<DocumentContent> {
    const documentContent = makeDocumentContent(data);

    await this.prisma.documentContent.create({
      data: PrismaDocumentContentMapper.toPrisma(documentContent),
    });

    return documentContent;
  }
}
