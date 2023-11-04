import { useTheme } from "@mui/material";
import { DataGrid, GridColDef, GridFilterModel } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fromPairs, groupBy, isUndefined, sortBy, toPairs } from "lodash";
import React, { useMemo } from "react";
import * as admin from "../../../protos/turbotin-Admin_connectquery";
import { Category, Tag, TagToTag } from "../../../protos/turbotin_pb";
import TagEditCell from "./editCell";
import { NULL_CAT, TRow, getChildren, getValidCats } from "./util";

type TProps = {
  cat: Category;
  tags: Tag[];
  links: TagToTag[];
  tagMap: Map<number, Tag>;
  catMap: Map<number, Category>;
  filterModel?: GridFilterModel;
};

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
  return sortBy([...result.values()], (r) => -r.id);
}

const TagGrid = (props: TProps): JSX.Element => {
  const { tags, cat, links, catMap, tagMap, filterModel } = props;

  const catValues = useMemo(() => groupBy(tags, (t) => t.categoryId), [tags]);
  const { mutateAsync: setTagToTags } = useMutation(
    admin.setTagToTags.useMutation()
  );
  const { mutateAsync: setTags } = useMutation(admin.setTags.useMutation());
  const queryClient = useQueryClient();

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
          (c): GridColDef<TRow, string | Tag> => ({
            field: String(c.id),
            headerName: c.name,
            flex: 1,
            valueGetter: ({ row }) => row[c.id]?.value,
            valueSetter:
              c === cat
                ? ({ row, value }) => {
                    if (value instanceof Tag) return row;
                    const tag = row[c.id].clone();
                    tag.value = value;
                    return { ...row, [c.id]: tag };
                  }
                : ({ row, value }) =>
                    value instanceof Tag ? { ...row, [c.id]: value } : row,
            editable: true,
            type: "string",
            ...(c !== cat && {
              renderEditCell: (params) => (
                <TagEditCell params={params} c={c} catValues={catValues} />
              ),
            }),
          })
        ),
    [cat, catMap, tagMap, links, catValues]
  );

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      loading={queryClient.isFetching() > 0 || queryClient.isMutating() > 0}
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
      processRowUpdate={async (newRow, oldRow) => {
        const id = newRow.id;
        for (const [k_, v] of toPairs(newRow)) {
          const k = parseInt(k_);
          if (!isFinite(k) || v === oldRow[k]) continue;
          if (k === cat.id) {
            try {
              await setTags({ items: [v] });
              await queryClient.invalidateQueries({
                queryKey: admin.getTags.getQueryKey(),
              });
              return newRow;
            } catch {
              return oldRow;
            }
          } else {
            const link = isUndefined(oldRow[k])
              ? new TagToTag({ parentTagId: id, tagId: newRow[k].id })
              : links.find(
                  (l) => l.tagId === oldRow[k].id && l.parentTagId === id
                );
            if (isUndefined(link)) return oldRow;
            const newLink = link.clone();
            newLink.tagId = v.id;
            try {
              await setTagToTags({ items: [newLink] });
              await queryClient.invalidateQueries({
                queryKey: admin.getTagToTags.getQueryKey(),
              });
              return newRow;
            } catch {
              return oldRow;
            }
          }
        }
        return oldRow;
      }}
    />
  );
};

export default TagGrid;
