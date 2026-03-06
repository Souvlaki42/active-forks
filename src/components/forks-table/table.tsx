"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { use, useMemo } from "react";
import type { Fork } from "~/lib/github/schema";
import { fuzzyFilter, type Result } from "~/lib/utils";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { columns } from "./columns";
import { PaginationControls } from "./pagination";

export function ForksTable({
  promisedData,
  loading = false,
}: {
  promisedData: Promise<Result<Fork[], Error>>;
  loading?: boolean;
}) {
  const [{ page, per_page }, setPagination] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      per_page: parseAsInteger.withDefault(30),
    },
    {
      history: "push",
      urlKeys: {
        page: "page",
        per_page: "per_page",
      },
    },
  );

  const [{ sort_id, sort_desc }, setSorting] = useQueryStates(
    {
      sort_id: parseAsStringEnum([
        "name",
        "owner",
        "branch",
        "stars",
        "forks",
        "watchers",
        "openIssues",
        "size",
        "lastPush",
      ]).withDefault("stars"),
      sort_desc: parseAsBoolean.withDefault(true),
    },
    {
      urlKeys: {
        sort_id: "sort",
        sort_desc: "desc",
      },
    },
  );

  const [{ filter_query }, setGlobalFilter] = useQueryStates(
    {
      filter_query: parseAsString.withDefault(""),
    },
    {
      urlKeys: {
        filter_query: "q",
      },
    },
  );

  const sortingState = useMemo(
    () => [{ id: sort_id, desc: sort_desc }],
    [sort_id, sort_desc],
  );

  const paginationState = useMemo(
    () => ({ pageIndex: page - 1, pageSize: per_page }),
    [page, per_page],
  );

  const { data, error } = use(promisedData);

  if (error) {
    if (error.message.includes("Not Found")) notFound();
    throw error;
  }

  const table = useReactTable({
    data: data ?? [],
    state: {
      pagination: paginationState,
      globalFilter: filter_query,
      sorting: sortingState,
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex: page - 1, pageSize: per_page })
          : updater;
      setPagination({ page: next.pageIndex + 1, per_page: next.pageSize });
    },
    onSortingChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater([{ id: sort_id, desc: sort_desc }])
          : updater;
      if (!next[0]) return;
      setSorting({
        sort_id: next[0].id as typeof sort_id,
        sort_desc: next[0].desc,
      });
    },
    onGlobalFilterChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(filter_query) : updater;
      setGlobalFilter({ filter_query: next });
    },
    columns,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter forks..."
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="odd:bg-muted">
                <TableCell colSpan={columns.length} className="h-48">
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="text-primary h-8 w-8 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="odd:bg-muted"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No data available for the table.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationControls table={table} />
    </div>
  );
}
