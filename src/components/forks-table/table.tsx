"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  type Updater,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { use, useMemo } from "react";
import type { Fork } from "~/lib/github/schema";
import { camelCaseToTitleCase, fuzzyFilter, type Result } from "~/lib/utils";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { columnList, columns } from "./columns";
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
      sort_id: parseAsStringEnum(columnList).withDefault("stars"),
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

  const [{ hidden_columns }, setHiddenColumns] = useQueryStates(
    {
      hidden_columns: parseAsArrayOf(parseAsString, ",").withDefault([]),
    },
    {
      urlKeys: {
        hidden_columns: "hidden",
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

  const columnVisibilityState = useMemo(() => {
    const hiddenColumnsObj: VisibilityState = {};
    columnList.forEach((col) => {
      hiddenColumnsObj[col] = !hidden_columns.includes(col);
    });
    return hiddenColumnsObj;
  }, [hidden_columns]);

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
      columnVisibility: columnVisibilityState,
    },
    onPaginationChange: (updater: Updater<PaginationState>) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex: page - 1, pageSize: per_page })
          : updater;
      setPagination({ page: next.pageIndex + 1, per_page: next.pageSize });
    },
    onSortingChange: (updater: Updater<SortingState>) => {
      const next =
        typeof updater === "function"
          ? updater([{ id: sort_id, desc: sort_desc }])
          : updater;
      if (next.length === 0) return;
      setSorting({
        sort_id: next[0].id,
        sort_desc: next[0].desc,
      });
    },
    onGlobalFilterChange: (updater: Updater<string>) => {
      const next =
        typeof updater === "function" ? updater(filter_query) : updater;
      setGlobalFilter({ filter_query: next });
    },
    onColumnVisibilityChange: (updater: Updater<VisibilityState>) => {
      const next =
        typeof updater === "function"
          ? updater(columnVisibilityState)
          : updater;
      setHiddenColumns({
        hidden_columns: Object.keys(next).filter((key) => !next[key]),
      });
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {camelCaseToTitleCase(column.id)}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
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
