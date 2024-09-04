import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { DocumentContentFactory } from "test/factories/make-document-content";

describe("fetch documents content (E2E)", () => {
  let app: INestApplication;
  let documentContentFactory: DocumentContentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DocumentContentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    documentContentFactory = moduleRef.get(DocumentContentFactory);

    await app.init();
  });

  test("[GET] /documents-content", async () => {
    await documentContentFactory.makeDocumentContent({
      originalDocument: "lorem original content",
      newDocument: "lorem new content",
      comment: "lorem comment",
      evaluation: "5",
      rules: "['rule-01', 'rule-02', 'rule-03']",
    });

    await documentContentFactory.makeDocumentContent({
      originalDocument: "lorem original content",
      newDocument: "lorem new content",
      comment: "lorem comment",
      evaluation: "4",
      rules: "['rule-10', 'rule-20', 'rule-30']",
    });

    const response = await request(app.getHttpServer()).get(
      "/documents-content",
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          rules: "['rule-01', 'rule-02', 'rule-03']",
          evaluation: "5",
          created_at: expect.any(String),
        }),
        expect.objectContaining({
          id: expect.any(String),
          rules: "['rule-10', 'rule-20', 'rule-30']",
          evaluation: "4",
          created_at: expect.any(String),
        }),
      ]),
    );
  });
});
