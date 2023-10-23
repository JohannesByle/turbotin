import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
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
