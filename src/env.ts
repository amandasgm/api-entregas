import { z } from "zod";  

const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(1, "JWT_SECRET must be provided"),
});

export const env = envSchema.parse(process.env);