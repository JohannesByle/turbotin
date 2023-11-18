import { AccountCircle, Login } from "@mui/icons-material";
import {
  AppBar,
  Box,
  CircularProgress,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  styled,
  useTheme,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useQuery } from "@tanstack/react-query";
import React, { Suspense, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LOGO_URL, TAB_OPACITY, TRoute } from "../consts";
import * as auth from "../protos/turbotin-Auth_connectquery";
import ROUTES from "../routes";
import Loading from "../util/components/loading";
import { usePromisify } from "../util/promisify";
import AuthDlg from "./auth/authDlg";
import { isAuthenticated } from "./auth/authProvider";
import { basePath } from "../util";
import { isUndefined, toPairs } from "lodash";

const Img = styled("img")``;

const { email_updates, full_table, individual_blends, my_account } = TRoute;

const NAV_ROUTES: TRoute[] = [full_table, individual_blends, email_updates];

const BaseView = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authDlg, showAuthDlg] = usePromisify(AuthDlg);

  const { data: user, isLoading } = useQuery(auth.getCurrentUser.useQuery());
  const isLoggedIn = (user?.email ?? "") !== "";
  const isAdmin = user?.isAdmin ?? false;

  const trigger = useScrollTrigger();

  const { palette } = useTheme();
  const buttonColor = palette.primary.contrastText;

  const routes = useMemo(
    () => [...NAV_ROUTES, ...(isAdmin ? [TRoute.admin] : [])],
    [isAdmin]
  );

  const route = basePath(location.pathname);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {authDlg}
      <AppBar elevation={trigger ? 4 : 0} sx={{ position: "unset" }}>
        <Toolbar>
          <Img
            src={LOGO_URL}
            sx={{
              height: "3em",
              width: "3em",
              mx: 1,
            }}
          />
          <Typography variant={"h5"} sx={{ my: "auto", mr: 1 }}>
            Turbotin
          </Typography>
          <Tabs
            value={routes.map(basePath).includes(route) && route}
            onChange={(e, v: string) => {
              const route = toPairs(ROUTES).find(([k]) => basePath(k) === v);
              if (!isUndefined(route) && isAuthenticated(route[1].level, user))
                navigate(`/${v}`);
            }}
            indicatorColor="secondary"
            textColor="inherit"
          >
            {routes.map((route) => {
              const { Icon, name, level } = ROUTES[route];
              const authenticated = isAuthenticated(level, user);
              return (
                <Tab
                  key={route}
                  value={basePath(route)}
                  label={name}
                  icon={<Icon />}
                  iconPosition="start"
                  disableRipple={!authenticated}
                  onClick={
                    authenticated
                      ? undefined
                      : async (e) => {
                          e.stopPropagation();
                          await showAuthDlg({});
                          navigate(route);
                        }
                  }
                />
              );
            })}
          </Tabs>
          <Box sx={{ mr: "auto" }} />
          {isLoading ? (
            <CircularProgress sx={{ color: buttonColor }} size={"32px"} />
          ) : isLoggedIn ? (
            <Tooltip title={"My Account"}>
              <IconButton onClick={() => navigate(my_account)}>
                <AccountCircle
                  sx={{
                    color: buttonColor,
                    opacity: location.pathname === my_account ? 1 : TAB_OPACITY,
                  }}
                />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title={"Login"}>
              <IconButton onClick={() => void showAuthDlg({})}>
                <Login sx={{ color: buttonColor, opacity: TAB_OPACITY }} />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          overflow: "auto",
          position: "relative",
        }}
      >
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </Box>
    </Box>
  );
};

export default BaseView;
