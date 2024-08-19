import { Module } from "@nestjs/common";
import { UploadController } from "./controllers/upload";
import { ExtractTextModule } from "../extract-text/extract-text.module";
import { ServicesModule } from "../services/services.module";

@Module({
  imports: [ExtractTextModule, ServicesModule],
  controllers: [UploadController],
})
export class HttpModule {}
