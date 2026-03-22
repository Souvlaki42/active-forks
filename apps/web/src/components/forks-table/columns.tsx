"use client";

import { createColumnHelper, type HeaderContext } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import type { Fork } from "~/actions/github";
import ClientDate from "../date";
import { ForkHeader } from "./header";

const helper = createColumnHelper<Fork>();

const header = <TKey, TValue>({ column }: HeaderContext<TKey, TValue>) => {
  return <ForkHeader column={column} />;
};

export const columns = [
  helper.accessor("name", {
    header,
    cell: ({
      row: {
        original: { link, name },
      },
    }) => (
      <Link
        href={link}
        target="_blank"
        className="text-blue-500 hover:underline"
        title={name}
      >
        <span className="truncate">{name}</span>
      </Link>
    ),
  }),
  helper.accessor("owner", {
    header,
    cell: ({
      row: {
        original: { owner, avatar },
      },
    }) => (
      <Link
        href={`https://github.com/${owner}`}
        target="_blank"
        className="flex items-center gap-2 text-blue-500 hover:underline min-w-0"
        title={owner}
      >
        <Image
          src={avatar}
          alt={owner}
          className="rounded-full"
          width={32}
          height={32}
        />
        <span className="truncate">{owner}</span>
      </Link>
    ),
  }),
  helper.accessor("branch", {
    header,
  }),
  helper.accessor("stars", {
    header,
  }),
  helper.accessor("forksCount", {
    header,
  }),
  helper.accessor("watchers", {
    header,
  }),
  helper.accessor("openIssues", {
    header,
  }),
  helper.accessor("size", {
    header,
    cell: ({ getValue }) => `${((getValue() ?? 0) / 1024).toFixed(2)} MB`,
  }),
  helper.accessor("lastPush", {
    header,
    cell: ({ getValue }) => {
      return <ClientDate date={getValue()} />;
    },
  }),
];

export const columnList = columns
  .map((col) => col.accessorKey)
  .filter((k): k is string => k !== undefined);
