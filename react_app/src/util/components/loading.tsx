import { Box, CircularProgress } from "@mui/material";
import React from "react";
import { CENTER_PAGE_SX } from "../../consts";

const Loading = (): JSX.Element => {
  return (
    <Box sx={CENTER_PAGE_SX}>
      <CircularProgress />
    </Box>
  );
};

export default Loading;
