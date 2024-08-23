import { InMemoryDocumentContentRepository } from "test/repositories/in-memory-document-content-repository";
import { SendRulesAndQuestionsForContentUseCase } from "./send-rules-and-questions-for-content";
import { makeDocumentContent } from "test/factories/make-document-content";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { FakeOpenAIService } from "test/services/fake-open-ai-service";

let inMemoryDocumentContentRepository: InMemoryDocumentContentRepository;
let fakeOpenAIService: FakeOpenAIService;
let sut: SendRulesAndQuestionsForContentUseCase;

describe("Send rules and questions for content", () => {
  beforeEach(() => {
    inMemoryDocumentContentRepository = new InMemoryDocumentContentRepository();

    fakeOpenAIService = new FakeOpenAIService();

    sut = new SendRulesAndQuestionsForContentUseCase(
      inMemoryDocumentContentRepository,
      fakeOpenAIService,
    );
  });

  test("should be able save rules and questions for document content and get a new content in document", async () => {
    const documentContent = makeDocumentContent(
      {},
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
        newDocument: expect.stringContaining(String()),
      }),
    );
  });
});
