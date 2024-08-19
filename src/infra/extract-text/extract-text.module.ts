import { Module } from "@nestjs/common";
import { ExtractText } from "src/domain/essay-orrector/application/extract-text/extract-text";
import { ExtractTextFromFile } from "./extract-text-from-file";

@Module({
  providers: [{ provide: ExtractText, useClass: ExtractTextFromFile }],
  exports: [ExtractText],
})
export class ExtractTextModule {}
