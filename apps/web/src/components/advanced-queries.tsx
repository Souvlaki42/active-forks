"use client";

import { Suspense } from "react";
import { useAdvancedQueryState } from "~/lib/state";
import { camelCaseToTitleCase } from "~/lib/utils";
import { columnList } from "./forks-table/columns";
import { type Field, QueryBuilder, QueryBuilderContext } from "./query-builder";

const fields: Field[] = columnList.map((col) => ({
  name: col,
  label: camelCaseToTitleCase(col),
}));

export function AdvancedQueries() {
  const [query, setQuery] = useAdvancedQueryState();
  return (
    <QueryBuilderContext>
      <Suspense fallback={<div>Loading...</div>}>
        <QueryBuilder query={query} onQueryChange={setQuery} fields={fields} />
      </Suspense>
    </QueryBuilderContext>
  );
}
