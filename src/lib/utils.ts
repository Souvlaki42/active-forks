import { rankItem } from "@tanstack/match-sorter-utils";
import type { FilterFn } from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "./env";
import type { Fork } from "./github/schema";

const REVALIDATE_MINUTES = 5;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fuzzyFilter: FilterFn<Fork> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

export const cachedFetch = (
  url: string,
  options: RequestInit,
  tags?: string[],
  revalidate: number = REVALIDATE_MINUTES,
) =>
  env.NODE_ENV === "development" && env.FORCE_DISABLE_CACHE
    ? fetch(url, { ...options, cache: "no-store" })
    : // WARNING: Data caching here only works when I use Vercel's infrastructure and local development.
      fetch(url, {
        ...options,
        next: {
          revalidate: revalidate * 60,
          tags,
        },
      });

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
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    console.error(`Failure: ${error}`);
    return { data: null, error: error as E };
  }
}

export const repoPattern = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/;

export function camelCaseToTitleCase(str: string) {
  const result = str.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}
