import Tesseract from "tesseract.js";
import mammoth from "mammoth";
import pdf from "pdf-parse";
import sharp from "sharp";
import { Injectable } from "@nestjs/common";
import { ExtractContentFromFileRepository } from "@/domain/essay-corrector/application/extract-content-from-file/extract-content-from-file-repository";

@Injectable()
export class ExtractContentFromFile
  implements ExtractContentFromFileRepository
{
  async extractContentFromPDF(fileBuffer: any): Promise<string> {
    try {
      const data = await pdf(fileBuffer);

      return data.text;
    } catch (err) {
      console.error("Erro ao processar o PDF:", err);
      return "";
    }
  }

  async extractContentFromDOCX(fileBuffer: any): Promise<string> {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  }

  async extractContentFromJPEGOrJPG(fileBuffer: any): Promise<string> {
    function preprocessImage(fileBuffer: Buffer): Promise<Buffer> {
      return sharp(fileBuffer)
        .resize(1200)
        .grayscale()
        .normalize()
        .threshold(128)
        .modulate({ brightness: 1.2, saturation: 1.0, lightness: 0.9 })
        .toBuffer();
    }

    try {
      const preprocessedImage = await preprocessImage(fileBuffer);

      const {
        data: { text },
      } = await Tesseract.recognize(preprocessedImage, "eng+por");

      return text;
    } catch (error) {
      console.error("Error extracting text from image:", error);
      throw new Error("Failed to extract text from image");
    }
  }
}
