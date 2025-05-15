import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { urlPattern } from "./utils";

export const env = createEnv({
  server: {
    GITHUB_API_TOKEN: z.string().min(1, "GitHub token is required"),
    UPSTASH_REDIS_REST_URL: z
      .string()
      .refine((url) => urlPattern.test(url), "Invalid Redis URL"),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1, "Redis token is required"),
    UPSTASH_REDIS_CACHE_TTL_SECONDS: z.number().default(60 * 60 * 24),
  },
  client: {},
  experimental__runtimeEnv: {},
  emptyStringAsUndefined: true,
});
