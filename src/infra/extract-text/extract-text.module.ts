import { Module } from "@nestjs/common";
import { ExtractTextFromFile } from "./extract-text-from-file";
import { ExtractText } from "@/domain/essay-corrector/application/extract-text/extract-text";

@Module({
  providers: [{ provide: ExtractText, useClass: ExtractTextFromFile }],
  exports: [ExtractText],
})
export class ExtractTextModule {}
