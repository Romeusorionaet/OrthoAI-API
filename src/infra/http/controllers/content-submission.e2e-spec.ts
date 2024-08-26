import { TextGenerationServiceRepository } from "@/domain/essay-corrector/application/text-generation-service/text-generation-service-repository";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { DocumentContentFactory } from "test/factories/make-document-content";

describe("Content submission (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let documentContentFactory: DocumentContentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DocumentContentFactory],
    })
      .overrideProvider(TextGenerationServiceRepository)
      .useValue({
        createCompletion: vi.fn().mockResolvedValue({
          correctedContent: "Conteúdo corrigido de exemplo.",
          evaluation: "4",
          questionVerification: [
            { "1": "Pergunta: Resposta 1." },
            { "2": "Pergunta: Resposta 2." },
            { "3": "Pergunta: Resposta 3." },
          ],
          comment: "Comentário resumido sobre o assunto.",
        }),
      })
      .compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    documentContentFactory = moduleRef.get(DocumentContentFactory);

    await app.init();
  });

  test("[POST]] /submit-content", async () => {
    const documentContent = await documentContentFactory.makeDocumentContent();

    const response = await request(app.getHttpServer())
      .post("/submit-content")
      .send({
        id: documentContent.id.toString(),
        rules: ["1- first rule", "2- second rule", "3- third rule"],
        questions: "1- Pergunta 1? 2- Pergunta 2? 3- Pergunta 3?",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ message: "success" });

    const documentContentOnDatabase = await prisma.documentContent.findUnique({
      where: {
        id: documentContent.id.toString(),
      },
    });

    const quizQuestionsOnDatabase = await prisma.quizQuestions.findFirst({
      where: {
        document_content_id: documentContent.id.toString(),
      },
    });

    expect(documentContentOnDatabase).toBeTruthy();
    expect(documentContentOnDatabase).toEqual(
      expect.objectContaining({
        id: documentContent.id.toString(),
        original_document: expect.stringContaining(String()),
        new_document: expect.stringContaining(String()),
        rules: '["1- first rule","2- second rule","3- third rule"]',
        comment: expect.stringContaining(String()),
      }),
    );

    expect(quizQuestionsOnDatabase).toEqual(
      expect.objectContaining({
        quiz: JSON.stringify([
          { "1": "Pergunta: Resposta 1." },
          { "2": "Pergunta: Resposta 2." },
          { "3": "Pergunta: Resposta 3." },
        ]),
      }),
    );
  });
});
