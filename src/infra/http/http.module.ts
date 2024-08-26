import { Module } from "@nestjs/common";
import { UploadController } from "./controllers/upload";
import { SaveDocumentContentUseCase } from "@/domain/essay-corrector/application/use-case/save-document-content";
import { ExtractContentModule } from "../extract-content/extract-content.module";
import { DatabaseModule } from "../database/database.module";
import { ContentSubmissionController } from "./controllers/content-submission";
import { SendRulesAndQuestionsForContentUseCase } from "@/domain/essay-corrector/application/use-case/send-rules-and-questions-for-content";
import { ServicesModule } from "../services/services.module";

@Module({
  imports: [DatabaseModule, ExtractContentModule, ServicesModule],
  controllers: [UploadController, ContentSubmissionController],
  providers: [
    SaveDocumentContentUseCase,
    SendRulesAndQuestionsForContentUseCase,
  ],
})
export class HttpModule {}
