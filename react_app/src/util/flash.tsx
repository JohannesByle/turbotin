import { Alert, AlertColor, Snackbar } from "@mui/material";
import { TSetState } from ".";
import React, { useCallback } from "react";
import { APP_BAR_ID } from "../consts";

export type TFlash = {
  msg: string;
  color: AlertColor;
};

type TProps = {
  flashes: Map<string, TFlash>;
  setFlashes: TSetState<Map<string, TFlash>>;
};

export const Flash = (props: TProps): JSX.Element => {
  const { flashes, setFlashes } = props;

  const appBarHeight = document.getElementById(APP_BAR_ID)?.offsetHeight ?? 0;

  const getOnClose = useCallback(
    (key: string) => () =>
      setFlashes((prev) => {
        const result = new Map(prev);
        result.delete(key);
        return result;
      }),
    [setFlashes]
  );

  return (
    <>
      {[...flashes.entries()].map(([key, { msg, color }]) => (
        <Snackbar
          key={key}
          open={true}
          onClose={getOnClose(key)}
          sx={{ mt: `${appBarHeight}px` }}
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
        >
          <Alert color={color} onClose={getOnClose(key)}>
            {msg}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};
