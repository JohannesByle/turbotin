import { ReportGmailerrorred } from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import cookie from "cookie";
import { ERROR_MSG_STR } from "../consts";

const Error = (): JSX.Element => {
  const { [ERROR_MSG_STR]: errorMsg } = cookie.parse(document.cookie);
  const { palette } = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        mt: "25vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ReportGmailerrorred
        sx={{ height: "10vh", width: "10vh", color: palette.text.secondary }}
      />
      <Typography variant={"h4"} color={palette.text.secondary}>
        {errorMsg}
      </Typography>
    </Box>
  );
};

export default Error;
