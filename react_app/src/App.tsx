import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toPairs } from "lodash";
import React from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { MS_PER_MINUTE, THEME, TRoute } from "./consts";
import ROUTES from "./routes";
import { FlashesProvider } from "./util/flash";
import AuthProvider from "./views/auth/authProvider";
import BaseView from "./views/baseView";

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
    errorElement: <Navigate to={TRoute.full_table} />,
  },
]);

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * MS_PER_MINUTE,
    },
  },
});

function App(): JSX.Element {
  return (
    <ThemeProvider theme={THEME}>
      <QueryClientProvider client={client}>
        <FlashesProvider>
          <CssBaseline />
          <RouterProvider router={router} />
        </FlashesProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
