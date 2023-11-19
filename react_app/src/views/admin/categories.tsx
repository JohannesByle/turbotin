import { Add } from "@mui/icons-material";
import { Box, IconButton, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isUndefined } from "lodash";
import React, { useCallback, useRef } from "react";
import { EMPTY_ARR, PALETTE, voidFn } from "../../consts";
import * as admin from "../../protos/turbotin-Admin_connectquery";
import { getCategories } from "../../protos/turbotin-Public_connectquery";
import { Category, CategoryList } from "../../protos/turbotin_pb";
import LoadingIcon from "../../util/components/loadingIcon";

const COLUMNS: Array<GridColDef<Category>> = [
  {
    field: "name" satisfies keyof Category,
    headerName: "Name",
    flex: 1,
    editable: true,
    type: "string",
  },
];

const Categories = (): JSX.Element => {
  const { data } = useQuery(getCategories.useQuery());

  const { mutateAsync: setCats, isLoading } = useMutation(
    admin.setCategories.useMutation()
  );
  const queryClient = useQueryClient();

  const newCatRef = useRef<HTMLInputElement>();

  const categories = data?.items ?? EMPTY_ARR;

  const addCat = useCallback(async () => {
    const el = newCatRef.current;
    if (isUndefined(el)) return;
    const value = el.value;
    if (value.length === 0) return;
    await setCats(new CategoryList({ items: [new Category({ name: value })] }));
    el.value = "";
    await queryClient.invalidateQueries({
      queryKey: getCategories.getQueryKey(),
    });
  }, [setCats, queryClient]);

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
      <Box sx={{ mx: 2, mt: 2, display: "flex", gap: 1, alignItems: "center" }}>
        <TextField
          inputRef={newCatRef}
          label="Add category"
          sx={{ backgroundColor: PALETTE.background.paper, ml: "auto" }}
          onKeyDown={(e) => {
            if (e.key === "Enter") void addCat();
          }}
        />
        <IconButton onClick={addCat} color="primary">
          {isLoading ? <LoadingIcon /> : <Add />}
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, height: "100%", minWidth: 0, p: 2, minHeight: 0 }}>
        <DataGrid
          rows={categories}
          loading={queryClient.isFetching() > 0 || queryClient.isMutating() > 0}
          columns={COLUMNS}
          sx={{ backgroundColor: PALETTE.background.paper }}
          processRowUpdate={async (newRow) => {
            await setCats(new CategoryList({ items: [newRow] })).catch(voidFn);
            await queryClient.invalidateQueries({
              queryKey: getCategories.getQueryKey(),
            });
            return newRow;
          }}
        />
      </Box>
    </Box>
  );
};

export default Categories;
