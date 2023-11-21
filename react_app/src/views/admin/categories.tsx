import { Add, Delete } from "@mui/icons-material";
import {
  Box,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isUndefined } from "lodash";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { EMPTY_ARR, ICON_COL_PROPS, PALETTE, voidFn } from "../../consts";
import * as admin from "../../protos/turbotin-Admin_connectquery";
import { getCategories } from "../../protos/turbotin-Public_connectquery";
import { Category, CategoryList } from "../../protos/turbotin_pb";
import LoadingIcon from "../../util/components/loadingIcon";

const Categories = (): JSX.Element => {
  const [deleting, setDeleting] = useState<boolean>(false);

  const { data } = useQuery(getCategories.useQuery());
  const queryClient = useQueryClient();
  const onSettled = (): void =>
    void queryClient.invalidateQueries({
      queryKey: getCategories.getQueryKey(),
    });
  const { mutateAsync: setCats, isLoading: isSaving } = useMutation({
    ...admin.setCategories.useMutation(),
    onSettled,
  });

  const { mutateAsync: deleteCats } = useMutation({
    ...admin.deleteCategories.useMutation(),
    onSettled,
  });

  const newCatRef = useRef<HTMLInputElement>();

  const categories = data?.items ?? EMPTY_ARR;

  const addCat = useCallback(async () => {
    const el = newCatRef.current;
    if (isUndefined(el)) return;
    const value = el.value;
    if (value.length === 0) return;
    await setCats(new CategoryList({ items: [new Category({ name: value })] }));
    el.value = "";
  }, [setCats]);

  const columns = useMemo(
    (): Array<GridColDef<Category>> => [
      {
        field: "name" satisfies keyof Category,
        headerName: "Name",
        flex: 1,
        editable: true,
        type: "string",
      },
      {
        field: "deleting",
        renderCell: ({ row }) => (
          <Tooltip title={"Delete category"}>
            <IconButton
              onClick={async () => {
                await deleteCats({ items: [row] });
                setDeleting(false);
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        ),
        ...ICON_COL_PROPS,
      },
    ],
    [deleteCats]
  );

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
        <FormControlLabel
          control={
            <Switch
              checked={deleting}
              onChange={(_, checked) => setDeleting(checked)}
              sx={{ ml: "auto" }}
            />
          }
          label="Delete mode"
          sx={{ color: PALETTE.text.secondary, ml: "auto" }}
        />
        <TextField
          inputRef={newCatRef}
          label="Add category"
          sx={{ backgroundColor: PALETTE.background.paper }}
          onKeyDown={(e) => {
            if (e.key === "Enter") void addCat();
          }}
        />
        <IconButton onClick={addCat} color="primary">
          {isSaving ? <LoadingIcon /> : <Add />}
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, height: "100%", minWidth: 0, p: 2, minHeight: 0 }}>
        <DataGrid
          rows={categories}
          loading={queryClient.isFetching() > 0 || queryClient.isMutating() > 0}
          columns={columns}
          sx={{ backgroundColor: PALETTE.background.paper }}
          processRowUpdate={async (newRow) => {
            await setCats(new CategoryList({ items: [newRow] })).catch(voidFn);
            return newRow;
          }}
          columnVisibilityModel={{ deleting }}
        />
      </Box>
    </Box>
  );
};

export default Categories;
