import { GridColDef, GridFilterModel } from "@mui/x-data-grid";
import { Dictionary, every, isString, isUndefined, toPairs } from "lodash";
import { Store } from "../../protos/turbotin_pb";
import { TRow, price } from "./util";

export const FILTER_FIELD = "74526c2d-cbac-4f07-ba46-223744b40912";
const FILTER_OP = "2a6aef33-ef8f-4070-9044-866b211b538b";

export const calcFilterModel = (filter: TFilter): GridFilterModel => ({
  items:
    Object.keys(filter).length > 0
      ? [{ field: FILTER_FIELD, operator: FILTER_OP, value: filter }]
      : [],
});

export const FILTER_COL: GridColDef<TRow> = {
  field: FILTER_FIELD,
  filterOperators: [
    {
      value: FILTER_OP,
      getApplyFilterFn: (filterItem) => {
        const filter = filterItem.value as TFilter | undefined;
        if (isUndefined(filter)) return null;
        const filters = Object.entries(filter).filter(
          ([, v]) => !isUndefined(v)
        ) as Array<[keyof TFilter, unknown]>;
        if (filters.length === 0) return null;
        return ({ row }) =>
          every(filters.map(([k]) => FILTER_FNS[k](row, filter)));
      },
    },
  ],
};

export type TFilter = {
  item?: string;
  maxPrice?: number;
  minPrice?: number;
  stores?: Set<Store>;
  inStock?: boolean;
  hasPrice?: boolean;
  tags: Dictionary<string>;
};

export const FILTER_FNS: Record<
  keyof TFilter,
  (row: TRow, filter: TFilter) => boolean | undefined
> = {
  item: ({ item }, filter) =>
    isString(item) &&
    isString(filter.item) &&
    item.toLowerCase().includes(filter.item.toLowerCase()),
  maxPrice: (row, { maxPrice = NaN }) => price(row) <= maxPrice,
  minPrice: (row, { minPrice = NaN }) => price(row) >= minPrice,
  stores: ({ store }, { stores = new Set() }) => stores.has(store),
  inStock: (row, { inStock = false }) => !inStock || row.inStock,
  hasPrice: (row, { hasPrice = false }) => !hasPrice || price(row) > 0,
  tags: (row, filter) =>
    !toPairs(filter.tags).some(([k, v]) => isString(v) && row.tags[k] !== v),
};
