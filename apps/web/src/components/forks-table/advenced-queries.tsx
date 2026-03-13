"use client";

import { useId } from "react";
import QueryBuilder from "react-querybuilder";
import { camelCaseToTitleCase } from "~/lib/utils";
import { QueryBuilderContext } from "../query-builder";
import { columnList } from "./columns";

export function AdvancedQueries() {
  const rootId = useId();

  const fields = columnList.map((col) => ({
    name: col,
    label: camelCaseToTitleCase(col),
  }));

  const defaultQuery = {
    id: rootId,
    combinator: "and",
    rules: [],
  };

  return (
    <QueryBuilderContext>
      <QueryBuilder defaultQuery={defaultQuery} fields={fields} />
    </QueryBuilderContext>
  );
}
