"use client";

import {
  functionalUpdate,
  type PaginationState,
  type SortingState,
  type Updater,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  createParser,
  debounce,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { useCallback, useMemo } from "react";
import {
  formatQuery,
  prepareRuleGroup,
  type RuleGroupType,
} from "react-querybuilder";
import { columnList } from "~/components/forks-table/columns";

const advancedQueryParser = createParser<RuleGroupType>({
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

export const useAdvancedQueryState = () => {
  const [query, setQuery] = useQueryState(
    "aq",
    advancedQueryParser
      .withDefault({
        id: "aq-0",
        combinator: "and",
        rules: [],
      })
      .withOptions({ limitUrlUpdates: debounce(500) }),
  );
  return [query, setQuery] as const;
};

export const usePaginationState = () => {
  const [{ page, per_page }, setPagination] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      per_page: parseAsInteger.withDefault(30),
    },
    {
      urlKeys: {
        page: "page",
        per_page: "per_page",
      },
    },
  );

  const paginationState = useMemo(
    () => ({ pageIndex: page - 1, pageSize: per_page }),
    [page, per_page],
  );

  const setPaginationState = useCallback(
    (updater: Updater<PaginationState>) => {
      const next = functionalUpdate(updater, {
        pageIndex: page - 1,
        pageSize: per_page,
      });
      setPagination({ page: next.pageIndex + 1, per_page: next.pageSize });
    },
    [page, per_page, setPagination],
  );

  return [paginationState, setPaginationState] as const;
};

export const useSortingState = () => {
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

  const sortingState = useMemo(
    () => [{ id: sort_id, desc: sort_desc }],
    [sort_id, sort_desc],
  );

  const setSortingState = useCallback(
    (updater: Updater<SortingState>) => {
      const next = functionalUpdate(updater, [
        { id: sort_id, desc: sort_desc },
      ]);
      setSorting({
        sort_id: next[0].id,
        sort_desc: next[0].desc,
      });
    },
    [sort_id, sort_desc, setSorting],
  );

  return [sortingState, setSortingState] as const;
};

export const useGlobalFilterState = () => {
  const [filter_query, setGlobalFilter] = useQueryState(
    "q",
    parseAsString
      .withDefault("")
      .withOptions({ limitUrlUpdates: debounce(300) }),
  );

  const globalFilterState = useMemo(() => ({ filter_query }), [filter_query]);

  const setGlobalFilterState = useCallback(
    (updater: Updater<string>) => {
      const next = functionalUpdate(updater, filter_query);
      setGlobalFilter(next);
    },
    [filter_query, setGlobalFilter],
  );

  return [globalFilterState, setGlobalFilterState] as const;
};

export const useColumnVisibilityState = () => {
  const [hidden_columns, setHiddenColumns] = useQueryState(
    "hidden",
    parseAsArrayOf(parseAsString, ",").withDefault([]),
  );

  const columnVisibilityState = useMemo(() => {
    const hiddenColumnsObj: VisibilityState = {};
    columnList.forEach((col) => {
      hiddenColumnsObj[col] = !hidden_columns.includes(col);
    });
    return hiddenColumnsObj;
  }, [hidden_columns]);

  const setColumnVisibilityState = useCallback(
    (updater: Updater<VisibilityState>) => {
      const next = functionalUpdate(updater, columnVisibilityState);
      setHiddenColumns(Object.keys(next).filter((key) => !next[key]));
    },
    [columnVisibilityState, setHiddenColumns],
  );

  return [columnVisibilityState, setColumnVisibilityState] as const;
};
