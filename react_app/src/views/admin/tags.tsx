import { Box, Tab, Tabs, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { first, isNumber, isUndefined } from "lodash";
import React, { useState } from "react";
import { EMPTY_ARR } from "../../consts";
import {
  getCategories,
  getTags,
} from "../../protos/turbotin-Admin_connectquery";
import { Category, Tag } from "../../protos/turbotin_pb";

function getChildren(cats: Category[], cat: Category): Category[] {
  const children = cats.filter((t) => t.parentId === cat.id);
  return [...children, ...children.flatMap((c) => getChildren(cats, c))];
}

const Tags = (): JSX.Element => {
  const { data: tags_ } = useQuery(getTags.useQuery());
  const { data: cats_ } = useQuery(getCategories.useQuery());

  const tags = tags_?.items ?? EMPTY_ARR;
  const cats = cats_?.items ?? EMPTY_ARR;

  const [selIds, setSelIds] = useState<Map<number, number>>(new Map());
  const [cat_, setCat] = useState<number | undefined>();

  const cat = cats.find((c) => c.id === cat_) ?? first(cats);

  const { palette } = useTheme();

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}
    >
      <Tabs
        value={cat?.id ?? false}
        onChange={(e, v: number) => setCat(v)}
        sx={{ backgroundColor: palette.background.paper }}
      >
        {cats
          .filter((c) => c.parentId === 0)
          .map((c, i) => (
            <Tab key={c.id} value={c.id} label={c.name} />
          ))}
      </Tabs>
      <Box sx={{ flex: 1, display: "flex", gap: 2, p: 2, minHeight: 0 }}>
        {isUndefined(cat) ? (
          <></>
        ) : (
          [cat, ...getChildren(cats, cat)].map((c) => {
            const selId = selIds.get(c.id);
            return (
              <Box key={c.id} sx={{ flex: 1, height: "100%", minWidth: 0 }}>
                <DataGrid
                  rows={tags.filter(
                    (t) =>
                      t.categoryId === c.id &&
                      (c.parentId === 0 ||
                        t.parentId === selIds.get(c.parentId))
                  )}
                  columns={[
                    {
                      field: "value" satisfies keyof Tag,
                      flex: 1,
                      headerName: c.name,
                    },
                  ]}
                  sx={{ backgroundColor: palette.background.paper }}
                  rowSelectionModel={isNumber(selId) ? [selId] : []}
                  onRowSelectionModelChange={(model) =>
                    setSelIds((prev) => {
                      const selId = first(model);
                      const result = new Map(prev);
                      isUndefined(selId)
                        ? result.delete(c.id)
                        : result.set(c.id, selId as number);
                      return result;
                    })
                  }
                />
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default Tags;
