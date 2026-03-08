import { z } from "zod";

const envSchema = z.object({
  GITHUB_API_TOKEN: z.string().min(1, "GitHub token is required"),
  NODE_ENV: z.enum(["development", "production", "test"]),
  FORCE_DISABLE_CACHE: z.boolean().default(false),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
