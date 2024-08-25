import { config } from "dotenv";
import { randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

config({ path: ".env", override: true });

const prisma = new PrismaClient();

function generateDatabaseName() {
  return `test_${randomUUID()}`;
}

const databaseName = generateDatabaseName();

beforeAll(async () => {
  const databaseURL = new URL(process.env.DATABASE_URL!);
  databaseURL.pathname = `/${databaseName}`;
  process.env.DATABASE_URL = databaseURL.toString();

  await prisma.$executeRawUnsafe(`CREATE DATABASE \`${databaseName}\``);

  execSync("npx prisma migrate deploy");
});

afterAll(async () => {
  await prisma.$disconnect();

  const cleanPrisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL!.replace(`/${databaseName}`, "/mysql"),
      },
    },
  });

  await cleanPrisma.$executeRawUnsafe(`DROP DATABASE \`${databaseName}\``);

  await cleanPrisma.$disconnect();
});
