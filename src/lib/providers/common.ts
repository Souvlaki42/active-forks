import {
  AutoComplete,
  Prettify,
  Result,
  tryCatch,
  Unpromisify,
} from "~/lib/utils";

import { z } from "zod";
import { ErrorWithCause } from "../errors";
import githubProvider from "./github";
import { CustomForkSchema, ForkResponseSchema } from "./github/schema";

export type Fork = z.infer<typeof CustomForkSchema>;

export type FetchArgs = {
  repo?: string[];
  page?: number;
  per_page?: 10 | 30 | 50 | 100;
};

type ProviderName = AutoComplete<"github">;

type CommonProvider<T> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => infer ReturnType
    ? (
        provider: ProviderName,
        ...args: Args
      ) => Promise<Result<Unpromisify<ReturnType>, ErrorWithCause>>
    : T[K];
};

export type ForkResponse = z.infer<typeof ForkResponseSchema>;

type ProviderStruct = {
  getForks: (args: FetchArgs) => Promise<Fork[]>;
  schemas: Record<string, z.ZodSchema>;
};

const providers: Record<ProviderName, ProviderStruct> = {
  github: githubProvider,
};

export const API: Prettify<CommonProvider<Omit<ProviderStruct, "schemas">>> = {
  getForks: async (provider: ProviderName, args: FetchArgs) => {
    "use server";
    const response = await tryCatch(providers[provider].getForks(args));
    if (!response.error) {
      return { data: response.data, error: null };
    } else {
      return { data: null, error: ErrorWithCause.from(response.error) };
    }
  },
};
