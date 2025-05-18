"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { Fork } from "~/lib/providers/common";
import ClientDate from "../date";
import { ForkHeader } from "./header";

export const columns: ColumnDef<Fork>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <ForkHeader column={column} title="Repo" />,
    cell: ({
      row: {
        original: { link, name },
      },
    }) => {
      return (
        <Link
          href={link}
          target="_blank"
          className="text-blue-500 hover:underline"
        >
          {name}
        </Link>
      );
    },
  },
  {
    accessorKey: "owner",
    header: ({ column }) => <ForkHeader column={column} title="Owner" />,
    cell: ({
      row: {
        original: { owner, avatar },
      },
    }) => {
      return (
        <Link
          href={`https://github.com/${owner}`}
          target="_blank"
          className="flex items-center gap-2 text-blue-500 hover:underline"
        >
          <Image
            src={avatar}
            alt={owner}
            className="rounded-full"
            width={32}
            height={32}
          />
          {owner}
        </Link>
      );
    },
  },
  {
    accessorKey: "branch",
    header: ({ column }) => (
      <ForkHeader column={column} title="Default Branch" />
    ),
  },
  {
    accessorKey: "stars",
    header: ({ column }) => <ForkHeader column={column} title="Stars" />,
  },
  {
    accessorKey: "forks",
    header: ({ column }) => <ForkHeader column={column} title="Forks" />,
  },
  {
    accessorKey: "watchers",
    header: ({ column }) => <ForkHeader column={column} title="Watchers" />,
  },
  {
    accessorKey: "openIssues",
    header: ({ column }) => <ForkHeader column={column} title="Open Issues" />,
  },
  {
    id: "size",
    accessorFn: (row) => `${(row.size / 1024).toFixed(2)} MB`,
    header: ({ column }) => <ForkHeader column={column} title="Size" />,
  },
  {
    id: "lastPush",
    accessorFn: (row) =>
      row.lastPush ? new Date(row.lastPush).toLocaleDateString() : "No date",
    header: ({ column }) => <ForkHeader column={column} title="Last Push" />,
    cell: ({ row }) => {
      return <ClientDate date={row.original.lastPush} />;
    },
  },
];
