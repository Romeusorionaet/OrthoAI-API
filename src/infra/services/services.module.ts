import { Module } from "@nestjs/common";
import { OpenAIService } from "./open-ai";
import { EnvService } from "../env/env.service";

@Module({
  providers: [{ provide: OpenAIService, useClass: EnvService }],
  exports: [OpenAIService],
})
export class ServicesModule {}
