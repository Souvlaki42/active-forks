"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTableSearchParams } from "tanstack-table-search-params";
import { ForkResponse } from "~/lib/providers/common";
import { ForksTable } from "./table";

export function QueryForksTable({
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
        globalFilter: "globalFilter",
        sorting: (defaultParamName) => defaultParamName,
        pagination: {
          pageIndex: "page",
          pageSize: "per_page",
        },
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

  return <ForksTable data={data} loading={loading} query={stateAndOnChanges} />;
}
