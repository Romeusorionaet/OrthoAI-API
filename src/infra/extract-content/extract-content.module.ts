import { Module } from "@nestjs/common";
import { ExtractContentFromFile } from "./extract-content-from-file";
import { ExtractContentFromFileRepository } from "@/domain/essay-corrector/application/extract-content-from-file/extract-content-from-file-repository";

@Module({
  providers: [
    {
      provide: ExtractContentFromFileRepository,
      useClass: ExtractContentFromFile,
    },
  ],
  exports: [ExtractContentFromFileRepository],
})
export class ExtractContentModule {}
