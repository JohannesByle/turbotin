import { AccountCircle, Login } from "@mui/icons-material";
import {
  AppBar,
  Box,
  IconButton,
  Tab,
  TabProps,
  Tabs,
  Toolbar,
  Tooltip,
  styled,
  useTheme,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import React, { useContext } from "react";
import {
  Navigate,
  Outlet,
  To,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { LOGO_URL, TAB_OPACITY, TRoute } from "../consts";
import { isNull } from "lodash";
import ROUTES from "../routes";
import { usePromisify } from "../util/promisify";
import { UserContext } from "../util/userContext";
import AuthDlg from "./auth/authDlg";
import { AuthService } from "../service";

const Img = styled("img")``;

const { email_updates, full_table, individual_blends, my_account } = TRoute;

const NAV_ROUTES: TRoute[] = [full_table, individual_blends, email_updates];

const tabProps = (route: TRoute): TabProps => {
  const { Icon, name } = ROUTES[route];
  return { value: route, label: name, icon: <Icon />, iconPosition: "start" };
};

const BaseView = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authDlg, showAuthDlg] = usePromisify({ Dlg: AuthDlg });
  const user = useContext(UserContext);

  const { palette } = useTheme();
  const buttonColor = palette.primary.contrastText;

  if (
    location.pathname === "/" ||
    (isNull(user) && location.pathname === my_account)
  )
    return <Navigate to={full_table} replace />;

  return (
    <>
      {authDlg}
      <AppBar position="static">
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
            value={
              (NAV_ROUTES as string[]).includes(location.pathname) &&
              location.pathname
            }
            onChange={(e, value) => navigate(value as To)}
            indicatorColor="secondary"
            textColor="inherit"
          >
            {NAV_ROUTES.map((route) => (
              <Tab key={route} {...tabProps(route)} />
            ))}
          </Tabs>
          <Box sx={{ mr: "auto" }} />
          {isNull(user) ? (
            <Tooltip title={"Login"}>
              <IconButton onClick={() => void showAuthDlg()}>
                <Login sx={{ color: buttonColor, opacity: TAB_OPACITY }} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title={"My Account"}>
              <IconButton
                onClick={() => {
                  void AuthService.postAuthGetCurrentUser();
                  navigate(my_account);
                }}
              >
                <AccountCircle
                  sx={{
                    color: buttonColor,
                    opacity: location.pathname === my_account ? 1 : TAB_OPACITY,
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
};

export default BaseView;
