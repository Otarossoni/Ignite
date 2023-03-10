import "dotenv/config";
import { z } from "zod";

// Cria o Schema do Zod para validação de variáveis de ambiente
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
});

// Realiza a validação
const _env = envSchema.safeParse(process.env);

// Trata possíveis erros
if (_env.success === false) {
  console.log("(w) Invalid environment variables!", _env.error.format());
  throw new Error("(E) Invalid environment variables!");
}

export const env = _env.data;
