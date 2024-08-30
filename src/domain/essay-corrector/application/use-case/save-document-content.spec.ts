import { InMemoryDocumentContentRepository } from "test/repositories/in-memory-document-content-repository";
import { SaveDocumentContentUseCase } from "./save-document-content";
import { ExtractContentFromFile } from "@/infra/extract-content/extract-content-from-file";
import path from "node:path";
import * as fs from "fs";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

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

    const fileBuffer = fs.readFileSync(filePath);

    const mimetype =
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    const result = await sut.execute({
      fileBuffer,
      mimetype,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.id).toBeInstanceOf(UniqueEntityID);
    }
    expect(inMemoryDocumentContentRepository.items).toHaveLength(1);

    const expectedContentFilePath = path.resolve(
      __dirname,
      "../../../../../test/data/comparer-content-test.txt",
    );

    const expectedContent = fs
      .readFileSync(expectedContentFilePath, "utf8")
      .replace(/\r\n/g, "\n")
      .trim();
    const actualContent =
      inMemoryDocumentContentRepository.items[0].originalDocument
        .replace(/\r\n/g, "\n")
        .trim();

    const normalizeText = (text: string) =>
      text.replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();

    const normalizedExpectedContent = normalizeText(expectedContent);
    const normalizedActualContent = normalizeText(actualContent);

    expect(normalizedActualContent).toBe(normalizedExpectedContent);
  });

  test("should be able extract content from file pdf, save and return an id", async () => {
    const filePath = path.resolve(
      __dirname,
      "../../../../../test/fixtures/test-ortho-ai.pdf",
    );

    const fileBuffer = fs.readFileSync(filePath);

    const mimetype = "application/pdf";

    const result = await sut.execute({
      fileBuffer,
      mimetype,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.id).toBeInstanceOf(UniqueEntityID);
    }
    expect(inMemoryDocumentContentRepository.items).toHaveLength(1);

    const expectedContentFilePath = path.resolve(
      __dirname,
      "../../../../../test/data/comparer-content-test.txt",
    );

    const expectedContent = fs
      .readFileSync(expectedContentFilePath, "utf8")
      .replace(/\r\n/g, "\n")
      .trim();
    const actualContent =
      inMemoryDocumentContentRepository.items[0].originalDocument
        .replace(/\r\n/g, "\n")
        .trim();

    const normalizeText = (text: string) =>
      text.replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();

    const normalizedExpectedContent = normalizeText(expectedContent);
    const normalizedActualContent = normalizeText(actualContent);

    expect(normalizedActualContent).toBe(normalizedExpectedContent);
  });

  test("should be able extract content from file image image, save and return an id", async () => {
    const filePath = path.resolve(
      __dirname,
      "../../../../../test/fixtures/test-ortho-ai.jpg",
    );

    const fileBuffer = fs.readFileSync(filePath);

    const mimetype = "image/jpg";

    const result = await sut.execute({
      fileBuffer,
      mimetype,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.id).toBeInstanceOf(UniqueEntityID);
    }
    expect(inMemoryDocumentContentRepository.items).toHaveLength(1);

    const expectedContentFilePath = path.resolve(
      __dirname,
      "../../../../../test/data/comparer-content-image-test.txt",
    );

    const expectedContent = fs
      .readFileSync(expectedContentFilePath, "utf8")
      .replace(/\r\n/g, "\n")
      .trim();

    const actualContent =
      inMemoryDocumentContentRepository.items[0].originalDocument
        .replace(/\r\n/g, "\n")
        .trim();

    const normalizeText = (text: string) =>
      text.replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();

    const normalizedExpectedContent = normalizeText(expectedContent);
    const normalizedActualContent = normalizeText(actualContent);

    expect(normalizedActualContent).toContain(normalizedExpectedContent);
  });
});
