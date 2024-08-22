import { ExtractContentFromFileRepository } from "@/domain/essay-corrector/application/extract-content-from-file/extract-content-from-file-repository";
import pdfParse from "pdf-parse";
import Tesseract from "tesseract.js";
import mammoth from "mammoth";

export class FakeExtractContentFromFile
  implements ExtractContentFromFileRepository
{
  async extractContentFromPDF(fileBuffer: any): Promise<string> {
    const parsedPdf = await pdfParse(fileBuffer);
    return parsedPdf.text;
  }

  async extractContentFromDOCX(fileBuffer: any): Promise<string> {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  }

  async extractContentFromJPEGOrJPG(fileBuffer: any): Promise<string> {
    const {
      data: { text: ocrText },
    } = await Tesseract.recognize(fileBuffer, "eng");
    return ocrText;
  }
}
