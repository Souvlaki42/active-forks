import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    GITHUB_API_TOKEN: z.string().min(1, "GitHub token is required"),
    NODE_ENV: z.enum(["development", "production", "test"]),
    FORCE_DISABLE_CACHE: z.boolean().default(false),
  },
  client: {},
  experimental__runtimeEnv: {}, // Only required for client variables
  emptyStringAsUndefined: true,
  skipValidation: process.env.GITHUB_ACTIONS === "true",
});
