import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseline from "@mui/material/CssBaseline";
import { cyan, grey, yellow } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios, { AxiosError } from "axios";
import { Buffer } from "buffer";
import cookie from "cookie";
import { StatusCodes } from "http-status-codes";
import { isString } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { CURRENT_USER_STR, FLASHES_STR } from "./consts";
import ROUTES from "./routes";
import { UserDetails } from "./service";
import { Flash, TFlash } from "./util/flash";
import { UserContext } from "./util/userContext";
import BaseView from "./views/baseView";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseView />,
    children: Object.entries(ROUTES).map(([path, details]) => ({
      path,
      ...details,
    })),
  },
]);

const theme = createTheme({
  palette: {
    primary: { main: cyan[800], contrastText: "white" },
    secondary: { main: yellow[300] },
    info: { main: grey[600] },
  },
});

function App(): JSX.Element {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [flashes, setFlashes] = useState<Map<string, TFlash>>(new Map());

  const setFlashesStr = useCallback((flashesStr: string) => {
    const flashes = new Map(
      (JSON.parse(flashesStr) as TFlash[]).map((flash) => [
        crypto.randomUUID(),
        flash,
      ])
    );
    setFlashes(flashes);
    setTimeout(
      () =>
        setFlashes((prev) => {
          const result = new Map(prev);
          for (const key of flashes.keys()) result.delete(key);
          return result;
        }),
      6000
    );
  }, []);

  useEffect(() => {
    const flashesStr = cookie.parse(document.cookie)[FLASHES_STR];

    if (isString(flashesStr) && flashesStr !== "") {
      setFlashesStr(Buffer.from(flashesStr, "base64").toString());
      document.cookie = cookie.serialize(FLASHES_STR, "");
    }
  }, [setFlashesStr]);

  useEffect(() => {
    axios.interceptors.response.use(
      (res) => {
        const userStr: unknown = res.headers[CURRENT_USER_STR];
        setUser(
          isString(userStr) ? (JSON.parse(userStr) as UserDetails) : null
        );
        const flashesStr: unknown = res.headers[FLASHES_STR];
        if (isString(flashesStr)) setFlashesStr(flashesStr);
        return res;
      },
      (e: AxiosError) => {
        if (e.response?.status === StatusCodes.UNAUTHORIZED) setUser(null);
        throw e;
      }
    );
  }, [setFlashesStr]);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={user}>
          <Flash flashes={flashes} setFlashes={setFlashes} />
          <CssBaseline />
          <RouterProvider router={router} />
        </UserContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
