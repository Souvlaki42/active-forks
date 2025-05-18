import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import { urlPattern } from "./singletons/regex";

export const env = createEnv({
  server: {
    GITHUB_API_TOKEN: z
      .string({ description: "GitHub token" })
      .min(1, "GitHub token is required"),
    UPSTASH_REDIS_REST_URL: z
      .string({ description: "Redis URL" })
      .refine((url) => urlPattern.test(url), "Invalid Redis URL"),
    UPSTASH_REDIS_REST_TOKEN: z
      .string({ description: "Redis token" })
      .min(1, "Redis token is required"),
    UPSTASH_REDIS_CACHE_TTL_SECONDS: z
      .number({ description: "Seconds to cache data" })
      .default(60 * 60 * 24),
  },
  client: {},
  experimental__runtimeEnv: {}, // Only required for client variables
  emptyStringAsUndefined: true,
  skipValidation: process.env.GITHUB_ACTIONS === "true",
});
