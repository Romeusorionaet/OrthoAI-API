export abstract class ExtractText {
  abstract extractTextFromPDF(fileBuffer: any): Promise<string>;
  abstract extractTextFromDOCX(payload: any): Promise<string>;
  abstract extractTextFromJPEGOrJPG(payload: any): Promise<string>;
}
