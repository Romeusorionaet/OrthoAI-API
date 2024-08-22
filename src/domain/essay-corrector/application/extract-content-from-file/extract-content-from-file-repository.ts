export abstract class ExtractContentFromFileRepository {
  abstract extractContentFromPDF(fileBuffer: Buffer): Promise<string>;
  abstract extractContentFromDOCX(fileBuffer: Buffer): Promise<string>;
  abstract extractContentFromJPEGOrJPG(fileBuffer: Buffer): Promise<string>;
}
