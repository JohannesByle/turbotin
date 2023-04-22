import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseline from "@mui/material/CssBaseline";
import { cyan, yellow } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios, { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";
import { isString } from "lodash";
import React, { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { CURRENT_USER_STR } from "./consts";
import { UserDetails } from "./service";
import { UserContext } from "./util/userContext";
import BaseView from "./views/baseView";
import ROUTES from "./routes";

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
  },
});

function App(): JSX.Element {
  const [user, setUser] = useState<UserDetails | null>(null);

  useEffect(() => {
    axios.interceptors.response.use(
      (res) => {
        const userStr: unknown = res.headers[CURRENT_USER_STR];
        setUser(
          isString(userStr) ? (JSON.parse(userStr) as UserDetails) : null
        );
        return res;
      },
      (e: AxiosError) => {
        console.log({ e });
        if (e.response?.status === StatusCodes.UNAUTHORIZED) setUser(null);
        throw e;
      }
    );
  }, [setUser]);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={user}>
          <CssBaseline />
          <RouterProvider router={router} />
        </UserContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
