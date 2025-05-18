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
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useTableSearchParams } from "tanstack-table-search-params";
import { Fork } from "~/lib/providers/common";
import { fuzzyFilter } from "~/lib/utils";
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
  data = [],
  loading = false,
}: {
  data?: Fork[];
  loading?: boolean;
}) {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const stateAndOnChanges = useTableSearchParams(
    {
      pathname,
      query: searchParams,
      replace,
    },
    {
      paramNames: {
        globalFilter: "q",
        pagination: {
          pageIndex: "page",
          pageSize: "per_page",
        },
        sorting: (defaultParamName) => defaultParamName,
        columnFilters: (defaultParamName) => defaultParamName,
        columnOrder: (defaultParamName) => defaultParamName,
        rowSelection: (defaultParamName) => defaultParamName,
      },
      defaultValues: {
        pagination: {
          pageIndex: 0,
          pageSize: 30,
        },
        sorting: [{ id: "stars", desc: true }],
      },
    }
  );

  const table = useReactTable({
    data: data,
    columns,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSorting: data.length !== 0,
    rowCount: data.length,
    ...stateAndOnChanges,
  });

  return (
    <div>
      <div className="flex items-center py-4">
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
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
