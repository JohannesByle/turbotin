import { DataGrid, GridColDef, GridFilterModel } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fromPairs, groupBy, isUndefined, sortBy, toPairs } from "lodash";
import React, { useMemo } from "react";
import { PALETTE } from "../../../consts";
import * as admin from "../../../protos/turbotin-Admin_connectquery";
import { getTobaccoToTags } from "../../../protos/turbotin-Public_connectquery";
import {
  Category,
  Tag,
  TagToTag,
  Tobacco,
  TobaccoToTag,
} from "../../../protos/turbotin_pb";
import TagEditCell from "../editCell";
import { NULL_CAT, TRow, getCats, getValidCats } from "./util";

type TProps = {
  tags: Tag[];
  tagLinks: TagToTag[];
  links: TobaccoToTag[];
  tobaccos: Tobacco[];
  tagMap: Map<number, Tag>;
  catMap: Map<number, Category>;
  filterModel?: GridFilterModel;
};

function tagsToRows(
  tobaccos: Tobacco[],
  catMap: Map<number, Category>,
  links: TobaccoToTag[],
  tagMap: Map<number, Tag>
): TRow[] {
  const result = new Map<number, TRow>();
  for (const tobacco of tobaccos) result.set(tobacco.id, { tobacco });
  for (const link of links) {
    const tag = tagMap.get(link.tagId);
    if (isUndefined(tag)) continue;
    const cat = catMap.get(tag.categoryId);
    if (isUndefined(cat)) continue;
    const dict = result.get(link.tobaccoId);
    if (isUndefined(dict)) continue;
    dict[cat.id] = tag;
  }
  return sortBy([...result.values()], (r) => -r.tobacco.id);
}

const getRowId = (row: TRow): number => row.tobacco.id;

const TobaccoLinksGrid = (props: TProps): JSX.Element => {
  const { tags, links, catMap, tagMap, filterModel, tobaccos, tagLinks } =
    props;

  const catValues = useMemo(() => groupBy(tags, (t) => t.categoryId), [tags]);

  const { mutateAsync: updateTobaccoToTag } = useMutation(
    admin.updateTobaccoToTag.useMutation()
  );

  const queryClient = useQueryClient();

  const children = getCats(catMap, tagMap, links);

  const rows = useMemo(
    () => tagsToRows(tobaccos, catMap, links, tagMap),
    [catMap, links, tagMap, tobaccos]
  );

  const columns = useMemo(
    (): Array<GridColDef<TRow>> => [
      {
        field: "Name",
        valueGetter: ({ row }) => row.tobacco.item,
        flex: 1,
      },
      ...getValidCats(catMap, tagMap, tagLinks)
        .filter((c) => c !== NULL_CAT)
        .map(
          (c): GridColDef<TRow, string | Tag> => ({
            field: String(c.id),
            headerName: c.name,
            flex: 1,
            valueGetter: ({ row }) => row[c.id]?.value,
            valueSetter: ({ row, value }) =>
              value instanceof Tag ? { ...row, [c.id]: value } : row,
            editable: true,
            type: "string",
            renderEditCell: (params) => (
              <TagEditCell params={params} c={c} catValues={catValues} />
            ),
          })
        ),
    ],
    [catMap, tagMap, tagLinks, catValues]
  );

  return (
    <DataGrid
      key={children.map((c) => c.name).join()}
      rows={rows}
      columns={columns}
      getRowId={getRowId}
      loading={queryClient.isFetching() > 0 || queryClient.isMutating() > 0}
      sx={{ backgroundColor: PALETTE.background.paper }}
      filterModel={filterModel}
      initialState={{
        columns: {
          columnVisibilityModel: fromPairs(
            columns.map((col, i) => [
              col.field,
              i === 0 || children.some((c) => String(c.id) === col.field),
            ])
          ),
        },
      }}
      disableColumnFilter
      processRowUpdate={async (newRow, oldRow) => {
        for (const [k_, v] of toPairs(newRow)) {
          const k = parseInt(k_);

          if (!isFinite(k) || v === oldRow[k]) continue;
          const tobaccoId = newRow.tobacco.id;
          const link = isUndefined(oldRow[k])
            ? new TobaccoToTag({ tobaccoId, tagId: newRow[k].id })
            : links.find(
                (l) => l.tagId === oldRow[k].id && l.tobaccoId === tobaccoId
              );
          if (isUndefined(link)) return oldRow;
          const newLink = link.clone();
          newLink.tagId = v.id;
          try {
            await updateTobaccoToTag(newLink);
            await queryClient.invalidateQueries({
              queryKey: getTobaccoToTags.getQueryKey(),
            });
            return newRow;
          } catch {
            return oldRow;
          }
        }
        return oldRow;
      }}
    />
  );
};

export default TobaccoLinksGrid;
