"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTableSearchParams } from "tanstack-table-search-params";
import { ForkResponse } from "~/lib/providers/common";
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
  data = { forks: [], total: 0 },
  loading = false,
}: {
  data?: ForkResponse;
  loading?: boolean;
}) {
  const { replace } = useRouter();
  const query = useSearchParams();
  const pathname = usePathname();

  const stateAndOnChanges = useTableSearchParams(
    {
      pathname,
      query,
      replace,
    },
    {
      paramNames: {
        pagination: {
          pageIndex: "page",
          pageSize: "perPage",
        },
      },
      defaultValues: {
        pagination: {
          pageIndex: 0,
          pageSize: 30,
        },
      },
    }
  );

  const table = useReactTable({
    data: data?.forks ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount: data?.total ?? 0,
    ...stateAndOnChanges,
  });

  return (
    <div>
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
      <PaginationControls table={table} total={data?.total ?? 0} />
    </div>
  );
}
