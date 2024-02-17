/* eslint-disable @typescript-eslint/promise-function-async */
import {
  AccountCircle,
  Email,
  Error as ErrorIcon,
  Home,
  ManageAccounts,
  Password,
  SvgIconComponent,
  Timeline,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import React, { lazy } from "react";
import { TAuthLevel, TRoute } from "./consts";
import Admin from "./views/admin";

const Account = lazy(() => import("./views/account/account"));
const ChangePassword = lazy(() => import("./views/auth/changePassword"));
const ResetPassword = lazy(() => import("./views/auth/resetPassword"));
const Error = lazy(() => import("./views/error"));
const FullTable = lazy(() => import("./views/fullTable"));
const VerifyEmail = lazy(() => import("./views/account/verifyEmail"));
const PriceHistory = lazy(() => import("./views/priceHistory"));
const Notifications = lazy(() => import("./views/notifications"));

const { none, user, admin } = TAuthLevel;

type TRouteDetails = {
  name: string;
  Icon: SvgIconComponent;
  element: JSX.Element;
  level: TAuthLevel;
  nav_hidden?: boolean;
};

const ROUTES: Record<TRoute, TRouteDetails> = {
  [TRoute.full_table]: {
    name: "Full Table",
    Icon: Home,
    element: <FullTable />,
    level: none,
  },
  [TRoute.individual_blends]: {
    name: "Price History",
    Icon: Timeline,
    element: <PriceHistory />,
    level: none,
  },
  [TRoute.individual_blend]: {
    name: "",
    Icon: Timeline,
    element: <PriceHistory />,
    level: none,
  },
  [TRoute.email_updates]: {
    name: "Notifications",
    Icon: NotificationsIcon,
    element: <Notifications />,
    level: user,
  },
  [TRoute.my_account]: {
    name: "",
    Icon: AccountCircle,
    element: <Account />,
    level: user,
  },
  [TRoute.reset_password]: {
    name: "",
    Icon: Password,
    element: <ResetPassword />,
    level: none,
  },
  [TRoute.change_password]: {
    name: "",
    Icon: Password,
    element: <ChangePassword />,
    level: none,
  },
  [TRoute.error]: {
    name: "",
    Icon: ErrorIcon,
    element: <Error />,
    level: none,
  },
  [TRoute.verify_email]: {
    name: "",
    Icon: Email,
    element: <VerifyEmail />,
    level: none,
  },
  [TRoute.admin]: {
    name: "Admin",
    Icon: ManageAccounts,
    element: <Admin />,
    level: admin,
  },
};

export default ROUTES;
