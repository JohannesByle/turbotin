import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseline from "@mui/material/CssBaseline";
import { cyan, grey, yellow } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useCallback, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ROUTES from "./routes";
import { UserDetails } from "./service";
import { Flash, TFlash, doSetFlashes, useFlashesCookie } from "./util/flash";
import { useInterceptors } from "./util/interceptors";
import { UserContext } from "./util/userContext";
import BaseView from "./views/baseView";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(relativeTime);

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
    background: { default: grey[100] },
  },
});

function App(): JSX.Element {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [flashes, setFlashes] = useState<Map<string, TFlash>>(new Map());

  const setFlashesStr = useCallback(
    (str: string) => doSetFlashes(str, setFlashes),
    []
  );

  useFlashesCookie(setFlashesStr);

  useInterceptors(setUser, setFlashesStr);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <UserContext.Provider value={user}>
          <Flash flashes={flashes} setFlashes={setFlashes} />
          <CssBaseline />
          <RouterProvider router={router} fallbackElement={<></>} />
        </UserContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
