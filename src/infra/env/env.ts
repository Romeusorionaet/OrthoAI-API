import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().optional().default(3333),
  OPENAI_API_KEY: z.string(),
  OPENAI_ORGANIZATION_ID: z.string(),
  OPENAI_PROJECT_ID: z.string(),
  WEB_HOST: z.string(),
});

export type Env = z.infer<typeof envSchema>;
