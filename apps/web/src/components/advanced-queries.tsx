"use client";

import { createParser, useQueryState } from "nuqs";
import { Suspense } from "react";
import { camelCaseToTitleCase } from "~/lib/utils";
import { columnList } from "./forks-table/columns";
import {
  type Field,
  formatQuery,
  prepareRuleGroup,
  QueryBuilder,
  QueryBuilderContext,
  type RuleGroupType,
} from "./query-builder";

const fields: Field[] = columnList.map((col) => ({
  name: col,
  label: camelCaseToTitleCase(col),
}));

const customAdvancedQueryParser = createParser<RuleGroupType>({
  parse: (value) => {
    let id = 0;
    return prepareRuleGroup<RuleGroupType>(JSON.parse(value), {
      idGenerator: () => {
        return `aq-${id++}`;
      },
    });
  },
  serialize: (value) => {
    return formatQuery(value, "json_without_ids");
  },
});

const optionsWithDefault = customAdvancedQueryParser.withDefault({
  id: "aq-0",
  combinator: "and",
  rules: [],
});

export function AdvancedQueries() {
  const [query, setQuery] = useQueryState("aq", optionsWithDefault);
  return (
    <QueryBuilderContext>
      <Suspense fallback={<div>Loading...</div>}>
        <QueryBuilder query={query} onQueryChange={setQuery} fields={fields} />
      </Suspense>
    </QueryBuilderContext>
  );
}
