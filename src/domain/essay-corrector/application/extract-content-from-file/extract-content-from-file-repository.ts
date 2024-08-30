export abstract class ExtractContentFromFileRepository {
  abstract extractContentFromPDF(fileBuffer: Buffer): Promise<string>;
  abstract extractContentFromDOCX(fileBuffer: Buffer): Promise<string>;
  abstract extractContentFromImage(fileBuffer: Buffer): Promise<string>;
}
