import { useQuery } from "@connectrpc/connect-query";
import { AccountCircle, Login, Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Box,
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  styled,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { isUndefined, toPairs } from "lodash";
import React, { Suspense, useMemo, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LOGO_URL, PALETTE, TAB_OPACITY, TRoute } from "../consts";
import * as auth from "../protos/turbotin-Auth_connectquery";
import ROUTES from "../routes";
import { basePath, useScreenSize } from "../util";
import Loading from "../util/components/loading";
import { usePromisify } from "../util/promisify";
import AuthDlg from "./auth/authDlg";
import { isAuthenticated } from "./auth/authProvider";

const Img = styled("img")``;

const { email_updates, full_table, individual_blends, my_account } = TRoute;

const NAV_ROUTES: TRoute[] = [full_table, individual_blends, email_updates];

const BaseView = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authDlg, showAuthDlg] = usePromisify(AuthDlg);
  const [anchorEl, setAnchorEl] = useState<Element | undefined>();

  const { data: user, isLoading } = useQuery(auth.getCurrentUser);
  const isLoggedIn = (user?.email ?? "") !== "";
  const isAdmin = user?.isAdmin ?? false;

  const trigger = useScrollTrigger();
  const { isMobile } = useScreenSize();

  const buttonColor = PALETTE.primary.contrastText;

  const routes = useMemo(
    () => [...NAV_ROUTES, ...(isAdmin ? [TRoute.admin] : [])],
    [isAdmin]
  );

  const route = basePath(location.pathname);

  const imgSize = isMobile ? "36px" : "48px";

  if (route === "") return <Navigate to={TRoute.full_table} />;
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
          <Img src={LOGO_URL} sx={{ height: imgSize, width: imgSize, mx: 1 }} />
          <Typography variant={"h5"} sx={{ my: "auto", mr: 1 }}>
            Turbotin
          </Typography>
          {isMobile ? (
            <></>
          ) : (
            <Tabs
              value={routes.map(basePath).includes(route) && route}
              onChange={(e, v: string) => {
                const route = toPairs(ROUTES).find(([k]) => basePath(k) === v);
                if (
                  !isUndefined(route) &&
                  isAuthenticated(route[1].level, user)
                )
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
          )}
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
          {isMobile ? (
            <>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MenuIcon sx={{ color: buttonColor, opacity: TAB_OPACITY }} />
              </IconButton>
              <Menu
                open={!isUndefined(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(undefined)}
              >
                {routes.map((route) => {
                  const { Icon, name, level } = ROUTES[route];
                  const authenticated = isAuthenticated(level, user);
                  return (
                    <MenuItem
                      key={name}
                      onClick={(e) => {
                        if (authenticated) {
                          navigate(route);
                        } else {
                          e.stopPropagation();
                          void showAuthDlg({}).then(() => navigate(route));
                        }
                        setAnchorEl(undefined);
                      }}
                    >
                      <ListItemIcon>
                        <Icon />
                      </ListItemIcon>
                      <ListItemText>{name}</ListItemText>
                    </MenuItem>
                  );
                })}
              </Menu>
            </>
          ) : (
            <></>
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
