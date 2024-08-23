import { PrismaDocumentContentRepository } from "@/infra/database/prisma/repositories/prisma-document-content-repository";
import { ExtractContentFromFile } from "@/infra/extract-content/extract-content-from-file";
import { SaveDocumentContentUseCase } from "../save-document-content";
import { PrismaService } from "@/infra/services/prisma";
import { EnvService } from "@/infra/env/env.service";
import { ConfigService } from "@nestjs/config";
import { Env } from "@/infra/env/env";

export function makeSaveDocumentContentUseCase() {
  const configService = new ConfigService<Env, true>();
  const config = new EnvService(configService);
  const prismaService = new PrismaService(config);
  const documentContentRepository = new PrismaDocumentContentRepository(
    prismaService,
  );
  const extractContentFromFileRepository = new ExtractContentFromFile();

  const useCase = new SaveDocumentContentUseCase(
    documentContentRepository,
    extractContentFromFileRepository,
  );

  return useCase;
}
