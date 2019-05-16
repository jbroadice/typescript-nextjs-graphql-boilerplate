import { state, resolve, Context } from "@loona/react";
import { print } from "graphql/language/printer";
import * as typeDefs from "./schema.graphql";
import { TablePaginationLimit } from "@types-generated";
import gql from "graphql-tag";

export type WithTypename<T> = T & { __typename: string };

const TABLE_VIEW_TYPES = ["users", "customers", "dealers", "subscribers"];

export interface TableViewsState {
  tablePaginationLimits: WithTypename<TablePaginationLimit>[];
}

const paginationLimitDefaults = (): WithTypename<TablePaginationLimit>[] =>
  TABLE_VIEW_TYPES.map((t) => ({
    id: t,
    limit: 10,
    __typename: "TablePaginationLimit",
  }));

@state({
  typeDefs: print(typeDefs),
  defaults: {
    tablePaginationLimits: paginationLimitDefaults(),
    filterPanels: [],
  } as TableViewsState,
})
export default class TableViews {
  @resolve("Query.tablePaginationLimits")
  tablePaginationLimits(_, { id }, context: Context) {
    return context.cache.readFragment({
      id: `TablePaginationLimit:${id}`,
      fragment: gql`
        fragment pageLimit on TablePaginationLimit {
          limit
        }
      `,
    });
  }
}
