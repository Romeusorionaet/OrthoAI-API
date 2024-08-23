import { InMemoryDocumentContentRepository } from "test/repositories/in-memory-document-content-repository";
import { makeDocumentContent } from "test/factories/make-document-content";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { GetDocumentContentUseCase } from "./get-document-content-use-case";
import { InMemoryQuizQuestionRepository } from "test/repositories/in-memory-quiz-question-repository";
import { makeQuizQuestion } from "test/factories/make-quiz-question";

let inMemoryDocumentContentRepository: InMemoryDocumentContentRepository;
let inMemoryQuizQuestionRepository: InMemoryQuizQuestionRepository;
let sut: GetDocumentContentUseCase;

describe("Get document content", () => {
  beforeEach(() => {
    inMemoryDocumentContentRepository = new InMemoryDocumentContentRepository();

    inMemoryQuizQuestionRepository = new InMemoryQuizQuestionRepository();

    sut = new GetDocumentContentUseCase(
      inMemoryDocumentContentRepository,
      inMemoryQuizQuestionRepository,
    );
  });

  test("should be able get a document content with quiz question by id", async () => {
    const documentContent = makeDocumentContent(
      {
        originalDocument: "lorem fake text...",
        newDocument: "new lorem fake text...",
        rules: "rule-01, rule-02, rule-03",
        comment: "fake comment",
        evaluation: "5",
      },
      new UniqueEntityID("document-01"),
    );

    const quizQuestion = makeQuizQuestion(
      {
        documentContentId: documentContent.id,
        quiz: "quiz-01, quiz-02, quiz-03",
      },
      new UniqueEntityID("quiz-01"),
    );

    await inMemoryDocumentContentRepository.create(documentContent);
    await inMemoryQuizQuestionRepository.create(quizQuestion);

    const result = await sut.execute({
      documentId: documentContent.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        documentContent: expect.objectContaining({
          id: new UniqueEntityID("document-01"),
          originalDocument: "lorem fake text...",
          newDocument: "new lorem fake text...",
          rules: "rule-01, rule-02, rule-03",
          comment: "fake comment",
          evaluation: "5",
        }),

        quizQuestion: expect.objectContaining({
          id: new UniqueEntityID("quiz-01"),
          documentContentId: new UniqueEntityID("document-01"),
          quiz: "quiz-01, quiz-02, quiz-03",
        }),
      }),
    );
  });
});
