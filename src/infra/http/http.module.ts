import { Module } from "@nestjs/common";
import { UploadController } from "./controllers/upload";
import { SaveDocumentContentUseCase } from "@/domain/essay-corrector/application/use-case/save-document-content";
import { ExtractContentModule } from "../extract-content/extract-content.module";
import { DatabaseModule } from "../database/database.module";
import { ContentSubmissionController } from "./controllers/content-submission";
import { ServicesModule } from "../services/services.module";
import { ContentSubmissionUseCase } from "@/domain/essay-corrector/application/use-case/content-submission";
import { GetDocumentContentController } from "./controllers/get-document-content";
import { GetDocumentContentUseCase } from "@/domain/essay-corrector/application/use-case/get-document-content-use-case";

@Module({
  imports: [DatabaseModule, ExtractContentModule, ServicesModule],
  controllers: [
    UploadController,
    ContentSubmissionController,
    GetDocumentContentController,
  ],
  providers: [
    SaveDocumentContentUseCase,
    ContentSubmissionUseCase,
    GetDocumentContentUseCase,
  ],
})
export class HttpModule {}
