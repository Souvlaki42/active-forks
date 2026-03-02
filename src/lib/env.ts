import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    GITHUB_API_TOKEN: z
      .string()
      .describe("GitHub API token")
      .min(1, "GitHub token is required"),
  },
  client: {},
  experimental__runtimeEnv: {}, // Only required for client variables
  emptyStringAsUndefined: true,
  skipValidation: process.env.GITHUB_ACTIONS === "true",
});
