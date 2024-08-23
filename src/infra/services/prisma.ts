import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { envSchema } from "../env/env";
import { EnvService } from "../env/env.service";

config();
console.log("Node env:", envSchema);

export class PrismaService {
  private prisma: PrismaClient;

  constructor(config: EnvService) {
    this.prisma = new PrismaClient({
      log: config.get("NODE_ENV") === "dev" ? ["query"] : [],
    });
  }

  getPrismaClient() {
    return this.prisma;
  }
}
