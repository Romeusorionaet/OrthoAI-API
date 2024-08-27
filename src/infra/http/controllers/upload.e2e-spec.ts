import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import path from "node:path";
import request from "supertest";

describe("Upload document file (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test("[POST] /upload-file (test with docx file)", async () => {
    const filePath = path.resolve(
      __dirname,
      "../../../../test/fixtures/test-ortho-ai.docx",
    );

    const response = await request(app.getHttpServer())
      .post("/upload-file")
      .attach("file", filePath);

    expect(response.statusCode).toBe(201);

    const documentContentId = response.body.documentContentId;

    const documentContentOnDatabase = await prisma.documentContent.findUnique({
      where: {
        id: documentContentId,
      },
    });

    expect(documentContentOnDatabase).toBeTruthy();
  });

  test("[POST] /upload-file (test with pdf file)", async () => {
    const filePath = path.resolve(
      __dirname,
      "../../../../test/fixtures/test-ortho-ai.pdf",
    );

    const response = await request(app.getHttpServer())
      .post("/upload-file")
      .attach("file", filePath);

    expect(response.statusCode).toBe(201);

    const documentContentId = response.body.documentContentId;

    const documentContentOnDatabase = await prisma.documentContent.findUnique({
      where: {
        id: documentContentId,
      },
    });

    expect(documentContentOnDatabase).toBeTruthy();
  });

  test("[POST] /upload-file (test with image file)", async () => {
    const filePath = path.resolve(
      __dirname,
      "../../../../test/fixtures/test-ortho-ai.png",
    );

    const response = await request(app.getHttpServer())
      .post("/upload-file")
      .attach("file", filePath);

    expect(response.statusCode).toBe(201);

    const documentContentId = response.body.documentContentId;

    const documentContentOnDatabase = await prisma.documentContent.findUnique({
      where: {
        id: documentContentId,
      },
    });

    expect(documentContentOnDatabase).toBeTruthy();
  });
});
