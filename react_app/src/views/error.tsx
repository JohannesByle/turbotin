import { ReportGmailerrorred } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import cookie from "cookie";
import React from "react";
import { ERROR_MSG_STR, PALETTE } from "../consts";

const Error = (): JSX.Element => {
  const { [ERROR_MSG_STR]: errorMsg } = cookie.parse(document.cookie);

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
        sx={{ height: "10vh", width: "10vh", color: PALETTE.text.secondary }}
      />
      <Typography variant={"h4"} color={PALETTE.text.secondary}>
        {errorMsg}
      </Typography>
    </Box>
  );
};

export default Error;
