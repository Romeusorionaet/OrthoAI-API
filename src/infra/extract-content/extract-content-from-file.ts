import Tesseract from "tesseract.js";
import mammoth from "mammoth";
import pdf from "pdf-parse";
import { Injectable } from "@nestjs/common";
import { ExtractContentFromFileRepository } from "@/domain/essay-corrector/application/extract-content-from-file/extract-content-from-file-repository";
import { preprocessImage } from "./helpers/process-image";
import { normalizeTextSpacing } from "./helpers/normalize-text-spacing";

@Injectable()
export class ExtractContentFromFile
  implements ExtractContentFromFileRepository
{
  async extractContentFromPDF(fileBuffer: Buffer): Promise<string> {
    try {
      const data = await pdf(fileBuffer);

      return normalizeTextSpacing(data.text);
    } catch (err) {
      console.error("Erro ao processar o PDF:", err);
      return "";
    }
  }

  async extractContentFromDOCX(fileBuffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return normalizeTextSpacing(result.value);
  }

  async extractContentFromImage(fileBuffer: Buffer): Promise<string> {
    try {
      const preprocessedImage = await preprocessImage(fileBuffer);

      const {
        data: { text },
      } = await Tesseract.recognize(preprocessedImage, "eng+por");

      return text;
    } catch (err) {
      console.error("Error extracting text from image:", err);
      throw new Error("Failed to extract text from image");
    }
  }
}
