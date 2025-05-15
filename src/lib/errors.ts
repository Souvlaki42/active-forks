import { RequestError } from "octokit";
import { z } from "zod";

type CauseType =
  | "INVALID_REPO"
  | "REPO_NOT_FOUND"
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
      typeof value.message === "string" &&
      "stack" in value &&
      typeof value.stack === "string")
  );
}

export class ErrorWithCause extends Error {
  cause: CauseType;
  constructor(message: string, cause: CauseType) {
    super(message, { cause });
    this.cause = cause;
  }
  static from(error?: unknown): ErrorWithCause {
    if (error instanceof ErrorWithCause) return error;
    if (error instanceof RequestError) {
      if (error.status === 404)
        return new ErrorWithCause(error.message, "REPO_NOT_FOUND");
      if (error.response?.headers["x-ratelimit-remaining"] === "0")
        return new ErrorWithCause(
          "You have reached the rate limit of your GitHub account. Please try again later.",
          "RATE_LIMIT_REACHED"
        );
      return new ErrorWithCause(error.message, "REQUEST_ERROR");
    }
    if (error instanceof z.ZodError)
      return new ErrorWithCause(error.message, "ZOD_PARSE_ERROR");
    if (isError(error))
      return new ErrorWithCause(error.message, "UNEXPECTED_ERROR");
    if (error instanceof Error)
      return new ErrorWithCause(error.message, "UNEXPECTED_ERROR");
    return new ErrorWithCause("Something went wrong", "UNEXPECTED_ERROR");
  }
}
