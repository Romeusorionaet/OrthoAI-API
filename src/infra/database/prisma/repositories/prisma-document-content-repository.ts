import { DocumentContentRepository } from "@/domain/essay-corrector/application/repositories/document-content-repository";
import { DocumentContent } from "@/domain/essay-corrector/enterprise/entities/document-content";
import { PrismaDocumentContentMapper } from "../mappers/prisma-document-content-mapper";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { PrismaService } from "../prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaDocumentContentRepository
  implements DocumentContentRepository
{
  constructor(private prisma: PrismaService) {}

  async create(
    documentContent: DocumentContent,
  ): Promise<{ id: UniqueEntityID }> {
    const data = PrismaDocumentContentMapper.toPrisma(documentContent);

    await this.prisma.documentContent.create({
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
