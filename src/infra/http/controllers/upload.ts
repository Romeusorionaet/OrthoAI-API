import {
  BadRequestException,
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ExtractText } from "src/domain/essay-corrector/application/extract-text/extract-text";
import { OpenAIService } from "src/infra/services/open-ai";

@Controller("/upload-file")
export class UploadController {
  constructor(
    private extractText: ExtractText,
    private readonly openaiService: OpenAIService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2mb
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<{ correctedText: string | null; originalText: string }> {
    const allowedMimeTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException("Tipo de arquivo não permitido.");
    }

    if (!file) {
      throw new BadRequestException("Nenhum arquivo foi enviado.");
    }

    const fileBuffer = file.buffer;
    const mimetype = file.mimetype;

    let extractedText = "";

    if (mimetype === "application/pdf") {
      extractedText = await this.extractText.extractTextFromPDF(fileBuffer);
    }

    if (
      mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      extractedText = await this.extractText.extractTextFromDOCX(fileBuffer);
    }

    if (mimetype === "image/jpeg" || mimetype === "image/jpg") {
      extractedText =
        await this.extractText.extractTextFromJPEGOrJPG(fileBuffer);
    }

    console.log(extractedText, "======extracted text");

    if (!extractedText) {
      throw new BadRequestException();
    }

    const roles = [
      "Ortografia: Verifique se a redação está escrita sem erros ortográficos. Sublinhe ou corrija qualquer erro encontrado.",
      "Gramática: Avalie a gramática, incluindo o uso correto de tempos verbais, concordância nominal e verbal, e pontuação.",
      "Coerência: Verifique se a redação apresenta uma sequência lógica de ideias, com argumentos claros e bem desenvolvidos.",
      "Coesão: Avalie o uso de conectivos e a fluidez entre os parágrafos e as frases para garantir que as ideias estejam interligadas de forma coesa.",
      "Relevância ao Tema: Verifique se a redação responde diretamente ao tema proposto, sem divagações ou tangentes irrelevantes.",
      "Adequação ao Gênero: Certifique-se de que a redação segue o gênero textual esperado (por exemplo, dissertativo-argumentativo).",
      "Tamanho: Verifique se o texto atende ao número de palavras exigido, sem ser muito curto ou excessivamente longo.",
      "Originalidade: Avalie a originalidade das ideias e argumentos apresentados, evitando respostas que sejam apenas cópias de informações comuns ou superficiais.",
      "Estrutura: Certifique-se de que a redação possui uma introdução, desenvolvimento e conclusão bem definidos.",
      "Criatividade: Pontue a criatividade e a profundidade das soluções ou propostas apresentadas no texto.",
    ];

    const formattedRoles = roles
      .map((regra, index) => `${index + 1}. ${regra}`)
      .join("\n");

    const questions = [
      "Quais fatores mantêm o trabalho infantil no Brasil?",
      "Como o trabalho infantil afeta o desenvolvimento das crianças?",
      "Como políticas públicas podem erradicar o trabalho infantil?",
    ];

    const formattedQuestions = questions
      .map((q, index) => `${index + 1}. ${q}`)
      .join("\n");

    const prompt = `
  Você é um assistente especializado em correção de redações. Aqui está uma redação que precisa ser corrigida e avaliada com uma nota de 0 a 10. 
  Além disso, verifique se a redação responde corretamente às questões fornecidas.

  Regras de correção: ${formattedRoles}
  
  Questões a serem respondidas: ${formattedQuestions}

  Redação original: ${extractedText}

  Por favor, forneça a resposta no seguinte formato:

  1. **Redação Corrigida:**
  [Aqui vai a redação corrigida]

  2. **Avaliação:**
  [Aqui vai a avaliação da redação, atribuindo uma nota de 0 a 10 com base nas regras fornecidas]

  3. **Verificação das Questões:**
  [Aqui vai a verificação das questões, indicando se as respostas estão corretas]
`;

    // const chatResponse = await this.openaiService.createCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "Você é um assistente útil e especializado em correção de redações",
    //     },
    //     {
    //       role: "user",
    //       content: prompt,
    //     },
    //   ],
    // });

    // const correctedText = chatResponse.choices[0].message.content;

    return {
      correctedText: "test",
      originalText: extractedText,
    };
  }
}
