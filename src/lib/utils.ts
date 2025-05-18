import { rankItem } from "@tanstack/match-sorter-utils";
import { FilterFn } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Fork } from "./providers/common";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AutoComplete<T extends string> = T | (string & {});

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export const fuzzyFilter: FilterFn<Fork> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

export type Unpromisify<T> = T extends Promise<infer U> ? U : T;
