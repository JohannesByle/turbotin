import { GridColDef, GridFilterModel } from "@mui/x-data-grid";
import { every, isArray, isString, isUndefined } from "lodash";
import { DOLLAR_REGEX } from "../../consts";
import { ObsTobacco } from "../../service";

export const calcPrice = ({ price }: ObsTobacco): number => {
  const result = price?.match(DOLLAR_REGEX);
  return isArray(result) && result.length > 1 ? Number(result[1]) : Infinity;
};

export const FILTER_FIELD = "74526c2d-cbac-4f07-ba46-223744b40912";
const FILTER_OP = "2a6aef33-ef8f-4070-9044-866b211b538b";

export const calcFilterModel = (filter: TFilter): GridFilterModel => ({
  items:
    Object.keys(filter).length > 0
      ? [{ field: FILTER_FIELD, operator: FILTER_OP, value: filter }]
      : [],
});

export const FILTER_COL: GridColDef<ObsTobacco> = {
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
  stores?: Set<string>;
  inStock?: boolean;
};

export const FILTER_FNS: Record<
  keyof TFilter,
  (row: ObsTobacco, filter: TFilter) => boolean | undefined
> = {
  item: ({ item }, filter) =>
    isString(item) &&
    isString(filter.item) &&
    item.toLowerCase().includes(filter.item.toLowerCase()),
  maxPrice: (row, { maxPrice = NaN }) => calcPrice(row) <= maxPrice,
  minPrice: (row, { minPrice = NaN }) => calcPrice(row) >= minPrice,
  stores: ({ store }, { stores = new Set() }) =>
    isString(store) && stores.has(store),
  inStock: ({ stock }, { inStock = false }) => !inStock || stock === "In Stock",
};
