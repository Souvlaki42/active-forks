import { rankItem } from "@tanstack/match-sorter-utils";
import { FilterFn } from "@tanstack/react-table";
import { Redis } from "@upstash/redis";
import { clsx, type ClassValue } from "clsx";
import { Octokit } from "octokit";
import { env } from "process";
import { twMerge } from "tailwind-merge";
import { Fork } from "./providers/common";

let octokit: Octokit | undefined;
let redis: Redis | undefined;

export const urlPattern = new RegExp(
  "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$",
  "i" // fragment locator
);

export const repoPattern = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AutoComplete<T extends string> = T | (string & {});

// Types for the result object with discriminated union
type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export const fuzzyFilter: FilterFn<Fork> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

export type Unpromisify<T> = T extends Promise<infer U> ? U : T;

export type Result<T, E = Error> = Success<T> | Failure<E>;

// Main wrapper function
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

export const getOctokit = () => {
  if (!octokit) {
    octokit = new Octokit({
      auth: env.GITHUB_API_TOKEN,
    });
  }
  return octokit;
};

export const getRedis = () => {
  if (!redis) {
    redis = Redis.fromEnv();
  }
  return redis;
};
