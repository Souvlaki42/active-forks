import { rankItem } from "@tanstack/match-sorter-utils";
import type { FilterFn } from "@tanstack/react-table";
import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import type { Fork } from "./github/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AutoComplete<T extends string> = T | (string & {});

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Unpromisify<T> = T extends Promise<infer U> ? U : T;

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard!");
};

export const fuzzyFilter: FilterFn<Fork> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

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
    console.error(error);
    return { data: null, error: error as E };
  }
}

export const repoPattern = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/;
