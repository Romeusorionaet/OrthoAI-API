import { InMemoryDocumentContentRepository } from "test/repositories/in-memory-document-content-repository";
import { SaveDocumentContentUseCase } from "./save-document-content";
import { ExtractContentFromFile } from "@/infra/extract-content/extract-content-from-file";
import path from "node:path";
import * as fs from "fs";

let inMemoryDocumentContentRepository: InMemoryDocumentContentRepository;
let extractContentFromFile: ExtractContentFromFile;
let sut: SaveDocumentContentUseCase;

describe("Save document content", () => {
  beforeEach(() => {
    inMemoryDocumentContentRepository = new InMemoryDocumentContentRepository();
    extractContentFromFile = new ExtractContentFromFile();

    sut = new SaveDocumentContentUseCase(
      inMemoryDocumentContentRepository,
      extractContentFromFile,
    );
  });

  test("should be able extract content from file docx, save and return an id", async () => {
    const filePath = path.resolve(
      __dirname,
      "../../../../../test/fixtures/test-ortho-ai.docx",
    );

    /** Title of the content into file 'test-ortho-ai.docx: 'A Exploração do Trabalho Infantil no Brasil...' */

    const fileBuffer = fs.readFileSync(filePath);

    const mimetype =
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    const result = await sut.execute({
      fileBuffer,
      mimetype,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({ id: expect.any(String) }),
    );
    expect(inMemoryDocumentContentRepository.items).toHaveLength(1);
    expect(inMemoryDocumentContentRepository.items[0]).toEqual(
      expect.objectContaining({
        originalDocument: expect.any(String),
      }),
    );
  });

  test("should be able extract content from file pdf, save and return an id", async () => {
    const filePath = path.resolve(
      __dirname,
      "../../../../../test/fixtures/test-ortho-ai.pdf",
    );

    /** Title of the content into file 'test-ortho-ai.docx: 'A Exploração do Trabalho Infantil no Brasil...' */

    const fileBuffer = fs.readFileSync(filePath);

    const mimetype = "application/pdf";

    const result = await sut.execute({
      fileBuffer,
      mimetype,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({ id: expect.any(String) }),
    );
    expect(inMemoryDocumentContentRepository.items).toHaveLength(1);
    expect(inMemoryDocumentContentRepository.items[0]).toEqual(
      expect.objectContaining({
        originalDocument: expect.any(String),
      }),
    );
  });

  test("should be able extract content from file image image, save and return an id", async () => {
    const filePath = path.resolve(
      __dirname,
      "../../../../../test/fixtures/test-image-content.png",
    );

    /** Title of the content into file 'test-ortho-ai.docx: 'O que é um text? */

    const fileBuffer = fs.readFileSync(filePath);

    const mimetype = "image/png";

    const result = await sut.execute({
      fileBuffer,
      mimetype,
    });

    // console.log(inMemoryDocumentContentRepository.items[0], "==========");

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({ id: expect.any(String) }),
    );
    expect(inMemoryDocumentContentRepository.items).toHaveLength(1);
    expect(inMemoryDocumentContentRepository.items[0]).toEqual(
      expect.objectContaining({
        originalDocument: expect.any(String),
      }),
    );
  });
});
