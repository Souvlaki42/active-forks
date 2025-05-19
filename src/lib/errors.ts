import { RequestError } from "octokit";
import { z } from "zod";

type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

export type Result<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E = Error>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}

type Cause =
  | "REPO_NOT_FOUND"
  | "INVALID_REPO"
  | "RATE_LIMIT_REACHED"
  | "ZOD_PARSE_ERROR"
  | "REQUEST_ERROR"
  | "UNEXPECTED_ERROR";

export function isError(value: unknown): value is Error {
  // @ts-expect-error Error.isError is not available yet in TypeScript
  if (typeof Error.isError === "function") {
    // @ts-expect-error Error.isError is not available yet in TypeScript
    return Error.isError(value);
  }
  return (
    value instanceof Error ||
    (!!value &&
      typeof value === "object" &&
      "name" in value &&
      typeof value.name === "string" &&
      "message" in value &&
      typeof value.message === "string")
  );
}

export class CustomError extends Error {
  digest?: string;
  constructor(message: string, cause: Cause = "UNEXPECTED_ERROR") {
    super(JSON.stringify({ message, cause }));
  }
  static isError(value: unknown): value is CustomError {
    return isError(value) && "cause" in value;
  }

  static unexpected() {
    return new CustomError("Something went wrong.");
  }

  static from(error?: unknown): CustomError {
    if (CustomError.isError(error)) return error;
    if (error instanceof RequestError) {
      if (error.status === 404)
        return new CustomError(error.message, "REPO_NOT_FOUND");
      if (error.response?.headers["x-ratelimit-remaining"] === "0")
        return new CustomError(
          "You have reached the rate limit of your GitHub account. Please try again later.",
          "RATE_LIMIT_REACHED"
        );
      return new CustomError(error.message, "REQUEST_ERROR");
    }
    if (error instanceof z.ZodError)
      return new CustomError(error.message, "ZOD_PARSE_ERROR");
    if (isError(error)) return new CustomError(error.message);
    if (error instanceof Error) return new CustomError(error.message);
    return CustomError.unexpected();
  }

  static parse(error?: unknown) {
    try {
      const expectedError = CustomError.from(error);
      return JSON.parse(expectedError.message);
    } catch {
      return CustomError.unexpected();
    }
  }

  get cause(): Cause {
    return CustomError.parse(this).cause;
  }
}
