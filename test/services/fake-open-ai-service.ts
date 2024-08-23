import {
  ResultCompletionProps,
  TextGenerationServiceRepository,
} from "@/domain/essay-corrector/application/text-generation-service/text-generation-service-repository";

export class FakeOpenAIService implements TextGenerationServiceRepository {
  async createCompletion(): Promise<ResultCompletionProps | null> {
    const resultTest = {
      correctedContent: "Conteúdo corrigido: Lorem...",
      evaluation: "4",
      questionVerification:
        "['question-01: response-01' , 'question-02: response-02', 'question-03: response-03']",
    };

    return resultTest;
  }
}
