import { Module } from "@nestjs/common";
import { ExtractContentFromFile } from "./extract-content-from-file";

@Module({
  providers: [
    { provide: ExtractContentFromFile, useClass: ExtractContentFromFile },
  ],
  exports: [ExtractContentFromFile],
})
export class ExtractContentModule {}
