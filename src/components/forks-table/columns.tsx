"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { Fork } from "~/lib/providers/common";
import ClientDate from "../date";

export const columns: ColumnDef<Fork>[] = [
	{
		header: "Repo",
		accessorKey: "name",
		cell: ({ row: { original: row } }) => {
			return (
				<Link
					href={row.link}
					target="_blank"
					className="text-blue-500 hover:underline"
				>
					{row.name}
				</Link>
			);
		},
	},
	{
		header: "Owner",
		accessorKey: "owner",
		cell: ({ row: { original: row } }) => {
			return (
				<Link
					href={`https://github.com/${row.owner}`}
					target="_blank"
					className="text-blue-500 hover:underline flex items-center gap-2"
				>
					<Image
						src={row.avatar}
						alt={row.owner}
						className="rounded-full"
						width={32}
						height={32}
					/>
					{row.owner}
				</Link>
			);
		},
	},
	{ header: "Branch", accessorKey: "branch" },
	{ header: "Stars", accessorKey: "stars" },
	{ header: "Forks", accessorKey: "forks" },
	{ header: "Watchers", accessorKey: "watchers" },
	{ header: "Open Issues", accessorKey: "openIssues" },
	{
		header: "Size",
		accessorKey: "size",
		cell: ({ row: { original: row } }) => {
			return `${(row.size / 1024).toFixed(2)} MB`;
		},
	},
	{
		header: "Last Push",
		accessorKey: "lastPush",
		cell: ({ row: { original: row } }) => {
			return <ClientDate date={row.lastPush} />;
		},
	},
];
