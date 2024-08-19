import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { EnvService } from "../env/env.service";

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(config: EnvService) {
    this.openai = new OpenAI({
      apiKey: config.get("OPENAI_API_KEY"),
      organization: config.get("OPENAI_ORGANIZATION_ID"),
      project: config.get("OPENAI_PROJECT_ID"),
    });
  }

  async createCompletion(params: any) {
    return this.openai.chat.completions.create(params);
  }
}
