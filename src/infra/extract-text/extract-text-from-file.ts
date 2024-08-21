import pdfParse from "pdf-parse";
import Tesseract from "tesseract.js";
import mammoth from "mammoth";
import { ExtractText } from "src/domain/essay-corrector/application/extract-text/extract-text";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ExtractTextFromFile implements ExtractText {
  async extractTextFromPDF(fileBuffer: any): Promise<string> {
    const parsedPdf = await pdfParse(fileBuffer);
    return parsedPdf.text;
  }

  async extractTextFromDOCX(fileBuffer: any): Promise<string> {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  }

  async extractTextFromJPEGOrJPG(fileBuffer: any): Promise<string> {
    const {
      data: { text: ocrText },
    } = await Tesseract.recognize(fileBuffer, "eng");
    return ocrText;
  }
}
