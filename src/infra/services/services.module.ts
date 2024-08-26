import { Module } from "@nestjs/common";
import { OpenAIService } from "./open-ai";
import { TextGenerationServiceRepository } from "@/domain/essay-corrector/application/text-generation-service/text-generation-service-repository";
import { EnvService } from "../env/env.service";

@Module({
  providers: [
    EnvService,
    { provide: TextGenerationServiceRepository, useClass: OpenAIService },
  ],
  exports: [EnvService, TextGenerationServiceRepository],
})
export class ServicesModule {}
