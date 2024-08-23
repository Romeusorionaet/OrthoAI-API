import { InMemoryDocumentContentRepository } from "test/repositories/in-memory-document-content-repository";
import { SendRulesAndQuestionsForContentUseCase } from "./send-rules-and-questions-for-content";
import { makeDocumentContent } from "test/factories/make-document-content";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { FakeOpenAIService } from "test/services/fake-open-ai-service";
import { InMemoryQuizQuestionRepository } from "test/repositories/in-memory-quiz-question-repository";

let inMemoryDocumentContentRepository: InMemoryDocumentContentRepository;
let fakeOpenAIService: FakeOpenAIService;
let inMemoryQuizQuestionRepository: InMemoryQuizQuestionRepository;
let sut: SendRulesAndQuestionsForContentUseCase;

describe("Send rules and questions for content", () => {
  beforeEach(() => {
    inMemoryDocumentContentRepository = new InMemoryDocumentContentRepository();

    fakeOpenAIService = new FakeOpenAIService();

    inMemoryQuizQuestionRepository = new InMemoryQuizQuestionRepository();

    sut = new SendRulesAndQuestionsForContentUseCase(
      inMemoryDocumentContentRepository,
      fakeOpenAIService,
      inMemoryQuizQuestionRepository,
    );
  });

  test("should be able save rules and questions for document content and get a new content in document", async () => {
    const documentContent = makeDocumentContent(
      { originalDocument: "lorem fake text..." },
      new UniqueEntityID("document-01"),
    );

    const questions = ["question-01", "question-02", "question-03"];

    const rules = ["rule-01", "rule-02", "rule-03"];

    await inMemoryDocumentContentRepository.create(documentContent);

    const result = await sut.execute({
      id: documentContent.id.toString(),
      questions: questions.toString(),
      rules: rules.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryDocumentContentRepository.items).toHaveLength(1);

    expect(inMemoryDocumentContentRepository.items[0]).toEqual(
      expect.objectContaining({
        id: new UniqueEntityID("document-01"),
        rules: expect.stringContaining("rule-01,rule-02,rule-03"),
        newDocument: "Conteúdo corrigido: lorem fake text...",
        evaluation: "4",
        comment: "Comentário gerado...",
      }),
    );

    expect(inMemoryQuizQuestionRepository.items[0]).toEqual(
      expect.objectContaining({
        documentContentId: documentContent.id.toString(),
        quiz: expect.stringContaining(
          "['question-01: response-01', 'question-02: response-02', 'question-03: response-03']",
        ),
      }),
    );
  });
});
