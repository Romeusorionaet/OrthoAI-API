import { Module } from "@nestjs/common";
import { PrismaDocumentContentRepository } from "./prisma/repositories/prisma-document-content-repository";
import { DocumentContentRepository } from "@/domain/essay-corrector/application/repositories/document-content-repository";
import { PrismaService } from "./prisma/prisma.service";

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: DocumentContentRepository,
      useClass: PrismaDocumentContentRepository,
    },
  ],
  exports: [PrismaService, DocumentContentRepository],
})
export class DatabaseModule {}
