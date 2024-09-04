import { InMemoryDocumentContentRepository } from "test/repositories/in-memory-document-content-repository";
import { makeDocumentContent } from "test/factories/make-document-content";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { FetchDocumentContentUseCase } from "./fetch-document-content";

let inMemoryDocumentContentRepository: InMemoryDocumentContentRepository;
let sut: FetchDocumentContentUseCase;

describe("Fetch document content", () => {
  beforeEach(() => {
    inMemoryDocumentContentRepository = new InMemoryDocumentContentRepository();

    sut = new FetchDocumentContentUseCase(inMemoryDocumentContentRepository);
  });

  test("should be able fetch many documents content, only with (evaluation, createdAt, rules, id) data", async () => {
    const documentContentOne = makeDocumentContent(
      {
        rules: "rule-01, rule-02, rule-03",
        evaluation: "5",
      },
      new UniqueEntityID("document-01"),
    );

    const documentContentTwo = makeDocumentContent(
      {
        rules: "rule-10, rule-20, rule-30",
        evaluation: "4",
      },
      new UniqueEntityID("document-02"),
    );

    await inMemoryDocumentContentRepository.create(documentContentOne);
    await inMemoryDocumentContentRepository.create(documentContentTwo);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        documentsContent: expect.arrayContaining([
          expect.objectContaining({
            id: "document-01",
            rules: "rule-01, rule-02, rule-03",
            evaluation: "5",
            created_at: expect.any(Date),
          }),
          expect.objectContaining({
            id: "document-02",
            rules: "rule-10, rule-20, rule-30",
            evaluation: "4",
            created_at: expect.any(Date),
          }),
        ]),
      }),
    );
  });
});
