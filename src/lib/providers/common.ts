import { AutoComplete, Result, tryCatch } from "~/lib/utils";

import { z } from "zod";
import { ErrorWithCause } from "../errors";
import githubProvider from "./github/api";
import { CustomForkSchema, ForkResponseSchema } from "./github/schema";

export type Fork = z.infer<typeof CustomForkSchema>;

export type FetchArgs = {
  repo?: string[];
  page?: number;
  perPage?: 10 | 30 | 50 | 100;
};

export type Providers = AutoComplete<"github">;

export type ForkResponse = z.infer<typeof ForkResponseSchema>;

const providers: Record<Providers, (args: FetchArgs) => Promise<ForkResponse>> =
  {
    github: githubProvider,
  };

export const getForks = async (
  provider: Providers = "github",
  args: FetchArgs
): Promise<Result<ForkResponse, ErrorWithCause>> => {
  "use server";

  const response = await tryCatch(providers[provider](args));

  if (!response.error) {
    return { data: response.data, error: null };
  } else {
    return { data: null, error: ErrorWithCause.from(response.error) };
  }
};
