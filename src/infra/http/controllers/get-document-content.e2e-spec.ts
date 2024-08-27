import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { DocumentContentFactory } from "test/factories/make-document-content";
import { QuizQuestionFactory } from "test/factories/make-quiz-question";

describe("Get document content (E2E)", () => {
  let app: INestApplication;
  let documentContentFactory: DocumentContentFactory;
  let quizQuestionFactory: QuizQuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DocumentContentFactory, QuizQuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    documentContentFactory = moduleRef.get(DocumentContentFactory);
    quizQuestionFactory = moduleRef.get(QuizQuestionFactory);

    await app.init();
  });

  test("[GET] /correction/:id", async () => {
    const documentContent = await documentContentFactory.makeDocumentContent({
      originalDocument: "lorem original content",
      newDocument: "lorem new content",
      comment: "lorem comment",
      evaluation: "5",
      rules: "['rule-1', 'rule-2', 'rule-3']",
    });

    await quizQuestionFactory.makeQuizQuestion({
      documentContentId: documentContent.id,
      quiz: "['question-1', 'question-2', 'question-3']",
    });

    console.log(documentContent, "=====");

    const response = await request(app.getHttpServer()).get(
      `/correction/${documentContent.id.toString()}`,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        documentContent: expect.objectContaining({
          originalDocumentContent: "lorem original content",
          newDocumentContent: "lorem new content",
          comment: "lorem comment",
          evaluation: "5",
          rules: "['rule-1', 'rule-2', 'rule-3']",
        }),
        quizQuestions: expect.objectContaining({
          quiz: "['question-1', 'question-2', 'question-3']",
        }),
      }),
    );
  });
});
