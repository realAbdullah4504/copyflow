import type { ColumnFiltersState } from "@tanstack/react-table";

export function toFilterObject(filters: ColumnFiltersState): Record<string, unknown> {
  return filters.reduce((acc, { id, value }) => {
    acc[id] = value;
    return acc;
  }, {} as Record<string, unknown>);
}
