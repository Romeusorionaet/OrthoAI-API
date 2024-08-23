import { DocumentContentRepository } from "@/domain/essay-corrector/application/repositories/document-content-repository";
import { DocumentContent } from "@/domain/essay-corrector/enterprise/entities/document-content";
import { PrismaService } from "@/infra/services/prisma";
import { PrismaDocumentContentMapper } from "../mappers/prisma-document-content-mapper";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class PrismaDocumentContentRepository
  implements DocumentContentRepository
{
  constructor(private prismaService: PrismaService) {}

  async create(
    documentContent: DocumentContent,
  ): Promise<{ id: UniqueEntityID }> {
    const prisma = this.prismaService.getPrismaClient();

    const data = PrismaDocumentContentMapper.toPrisma(documentContent);

    await prisma.documentContent.create({
      data,
    });

    return { id: documentContent.id };
  }

  async update(documentContent: DocumentContent): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findById(id: string): Promise<DocumentContent | null> {
    throw new Error("Method not implemented.");
  }
}
