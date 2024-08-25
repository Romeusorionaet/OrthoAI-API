import { Module } from "@nestjs/common";
import { UploadController } from "./controllers/upload";
import { SaveDocumentContentUseCase } from "@/domain/essay-corrector/application/use-case/save-document-content";
import { ExtractContentModule } from "../extract-content/extract-content.module";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule, ExtractContentModule],
  controllers: [UploadController],
  providers: [SaveDocumentContentUseCase],
})
export class HttpModule {}
