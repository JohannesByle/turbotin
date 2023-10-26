import CssBaseline from "@mui/material/CssBaseline";
import { cyan, grey, yellow } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { MS_PER_MINUTE } from "./consts";
import ROUTES from "./routes";
import { FlashesProvider } from "./util/flash";
import BaseView from "./views/baseView";
import { toPairs } from "lodash";
import AuthProvider from "./views/auth/authProvider";

dayjs.extend(relativeTime);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseView />,
    children: toPairs(ROUTES).map(([path, { element, level, ...details }]) => ({
      path,
      element: <AuthProvider level={level}>{element}</AuthProvider>,
      ...details,
    })),
  },
]);

const client = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 5 * MS_PER_MINUTE,
      staleTime: 5 * MS_PER_MINUTE,
    },
  },
});

const theme = createTheme({
  palette: {
    primary: { main: cyan[800], contrastText: "white" },
    secondary: { main: yellow[300] },
    info: { main: grey[600] },
    background: { default: grey[100] },
  },
});

function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={client}>
        <FlashesProvider>
          <CssBaseline />
          <RouterProvider router={router} fallbackElement={<></>} />
        </FlashesProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
