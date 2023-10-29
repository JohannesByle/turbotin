import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { EMPTY_ARR } from "../../consts";
import { getCategories } from "../../protos/turbotin-Admin_connectquery";
import { Category } from "../../protos/turbotin_pb";

const Categories = (): JSX.Element => {
  const { data } = useQuery(getCategories.useQuery());

  const { palette } = useTheme();

  const categories = data?.items ?? EMPTY_ARR;

  return (
    <Box
      sx={{
        height: "100%",
        flex: 1,
        p: 4,
        display: "flex",
        gap: 2,
        width: "100%",
        minWidth: 0,
      }}
    >
      <DataGrid
        rows={categories}
        columns={[{ field: "name" satisfies keyof Category, flex: 1 }]}
        sx={{ backgroundColor: palette.background.paper }}
      />
    </Box>
  );
};

export default Categories;
