import { Alert, AlertColor, Snackbar } from "@mui/material";
import { TSetState } from ".";
import React, { useCallback, useEffect } from "react";
import { APP_BAR_ID, FLASHES_STR } from "../consts";
import { isString } from "lodash";
import cookie from "cookie";
import { Buffer } from "buffer";

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

export const doSetFlashes = (
  flashesStr: string,
  setFlashes: TSetState<Map<string, TFlash>>
): void => {
  const flashes = new Map(
    (JSON.parse(flashesStr) as TFlash[]).map((flash) => [
      crypto.randomUUID(),
      flash,
    ])
  );
  setFlashes((prev) => {
    const result = new Map(prev);
    for (const [key, value] of flashes.entries()) result.set(key, value);
    return result;
  });
  setTimeout(
    () =>
      setFlashes((prev) => {
        const result = new Map(prev);
        for (const key of flashes.keys()) result.delete(key);
        return result;
      }),
    6000
  );
};

export const useFlashesCookie = (
  setFlashesStr: (flashesStr: string) => void
): void => {
  useEffect(() => {
    const flashesStr = cookie.parse(document.cookie)[FLASHES_STR];
    if (isString(flashesStr) && flashesStr !== "") {
      setFlashesStr(Buffer.from(flashesStr, "base64").toString());
      document.cookie = cookie.serialize(FLASHES_STR, "");
    }
  }, [setFlashesStr]);
};
