import { Module } from "@nestjs/common";
import { UploadController } from "./controllers/upload";
import { ServicesModule } from "../services/services.module";
import { ExtractContentModule } from "../extract-content/extract-content.module";

@Module({
  imports: [ExtractContentModule, ServicesModule],
  controllers: [UploadController],
})
export class HttpModule {}
