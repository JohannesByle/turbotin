import { Autocomplete, TextField, useTheme } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridRenderEditCellParams,
} from "@mui/x-data-grid";
import {
  Dictionary,
  NumericDictionary,
  fromPairs,
  groupBy,
  isUndefined,
  sortBy,
} from "lodash";
import React, { useEffect, useMemo, useRef } from "react";
import { Category, Tag, TagToTag } from "../../../protos/turbotin_pb";
import { NULL_CAT, getChildren, getValidCats } from "./util";

type TProps = {
  cat: Category;
  tags: Tag[];
  links: TagToTag[];
  tagMap: Map<number, Tag>;
  catMap: Map<number, Category>;
  filterModel?: GridFilterModel;
};

type TRow = NumericDictionary<Tag> & { id: number };

function tagsToRows(
  cat: Category,
  catMap: Map<number, Category>,
  links: TagToTag[],
  tagMap: Map<number, Tag>
): TRow[] {
  const result = new Map<number, TRow>();
  for (const tag of tagMap.values())
    if (tag.categoryId === cat.id)
      result.set(tag.id, { [tag.categoryId]: tag, id: tag.id });
  for (const link of links) {
    const parentTag = tagMap.get(link.parentTagId);
    const childTag = tagMap.get(link.tagId);
    if (isUndefined(childTag) || isUndefined(parentTag)) continue;
    const parentCat = catMap.get(parentTag.categoryId);
    const childCat = catMap.get(childTag.categoryId);
    if (isUndefined(parentCat) || isUndefined(childCat)) continue;
    if (parentCat === cat) {
      const dict = result.get(link.parentTagId);
      if (isUndefined(dict)) continue;
      dict[childCat.id] = childTag;
    }
  }
  return [...result.values()];
}

type TEditCellProps = {
  params: GridRenderEditCellParams<TRow>;
  c: Category;
  catValues: Dictionary<Tag[]>;
};

const EditCell = (props: TEditCellProps): JSX.Element => {
  const { c, catValues, params } = props;
  const { row, api, hasFocus } = params;

  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (hasFocus) {
      ref.current?.focus();
      ref.current?.click();
    }
  }, [hasFocus]);

  return (
    <Autocomplete
      ref={ref}
      value={row[c.id]}
      options={sortBy(catValues[c.id], (c) => c.value)}
      onChange={(_, value) => void api.setEditCellValue({ ...params, value })}
      sx={{ border: 0, width: "100%" }}
      renderInput={(params) => <TextField {...params} label="" />}
      getOptionLabel={(t) => t.value}
      disableClearable
    />
  );
};

const TagGrid = (props: TProps): JSX.Element => {
  const { tags, cat, links, catMap, tagMap, filterModel } = props;

  const catValues = useMemo(() => groupBy(tags, (t) => t.categoryId), [tags]);

  const children = getChildren(cat, catMap, tagMap, links);

  const { palette } = useTheme();

  const rows = useMemo(
    () => tagsToRows(cat, catMap, links, tagMap),
    [cat, catMap, links, tagMap]
  );

  const columns = useMemo(
    (): Array<GridColDef<TRow>> =>
      getValidCats(cat, catMap, tagMap, links)
        .filter((c) => c !== NULL_CAT)
        .map(
          (c): GridColDef<TRow> => ({
            field: String(c.id),
            headerName: c.name,
            flex: 1,
            valueGetter: ({ row }) => row[c.id]?.value,
            valueSetter: ({ row, value }) => {
              console.log(value);
              return row;
            },
            editable: c !== cat,
            type: "string",
            renderEditCell: (params) => (
              <EditCell params={params} c={c} catValues={catValues} />
            ),
          })
        ),
    [cat, catMap, tagMap, links, catValues]
  );

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      sx={{ backgroundColor: palette.background.paper }}
      filterModel={filterModel}
      initialState={{
        columns: {
          columnVisibilityModel: fromPairs(
            columns.map((col) => [
              col.field,
              [cat, ...children].some((c) => String(c.id) === col.field),
            ])
          ),
        },
      }}
      disableColumnFilter
      processRowUpdate={(newRow, oldRow) => {
        console.log({ newRow, oldRow });
        return oldRow;
      }}
    />
  );
};

export default TagGrid;
