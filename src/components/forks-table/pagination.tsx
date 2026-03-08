import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function PaginationControls<TData>({ table }: { table: Table<TData> }) {
  const { pageIndex, pageSize } = table.getState().pagination;

  const total = table.getRowCount();
  const start = pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, total);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-y-2">
      <div className="flex flex-wrap items-center justify-between gap-x-4 lg:gap-x-6 gap-y-2">
        <div className="text-muted-foreground text-sm">
          {total > 0 && `Showing ${start} to ${end} of ${total}`}
          {total === 0 && "No results found"}
        </div>

        <div className="flex items-center gap-x-2">
          <p className="text-sm font-medium hidden md:block">Rows per page</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => table.setPageSize(parseInt(value, 10))}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent side="top">
              {[...new Set([10, 30, 50, 70, 100, pageSize])]
                .toSorted((a, b) => a - b)
                .map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 lg:gap-x-8 gap-y-2">
        <div className="flex w-24 items-center justify-center text-sm font-medium">
          {total > 0 && `Page ${pageIndex + 1} of ${table.getPageCount()}`}
          {total === 0 && "Page 0 of 0"}
        </div>

        <div className="flex items-center gap-x-2">
          <Button
            variant="outline"
            className="hidden size-8 p-2 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="p-2 size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8 p-2"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden p-2 size-8 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
