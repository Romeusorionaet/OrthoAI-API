import {
  CompletionProps,
  ResultCompletionProps,
  TextGenerationServiceRepository,
} from "@/domain/essay-corrector/application/text-generation-service/text-generation-service-repository";

export class FakeOpenAIService implements TextGenerationServiceRepository {
  async createCompletion({
    content,
  }: CompletionProps): Promise<ResultCompletionProps | null> {
    const fakeResult = {
      correctedContent: `Conteúdo corrigido: ${content}`,
      evaluation: "4",
      questionVerification: [
        "question-01: response-01",
        "question-02: response-02",
        "question-03: response-03",
      ],
      comment: "Comentário gerado...",
    };

    return fakeResult;
  }
}
