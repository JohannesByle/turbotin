/* eslint-disable @typescript-eslint/promise-function-async */
import {
  AccountCircle,
  Email,
  Error as ErrorIcon,
  Home,
  Notifications,
  Password,
  SvgIconComponent,
  Timeline,
} from "@mui/icons-material";
import React, { lazy } from "react";
import { TRoute } from "./consts";

const Account = lazy(() => import("./views/account/account"));
const ChangePassword = lazy(() => import("./views/auth/changePassword"));
const ResetPassword = lazy(() => import("./views/auth/resetPassword"));
const Error = lazy(() => import("./views/error"));
const FullTable = lazy(() => import("./views/fullTable"));
const VerifyEmail = lazy(() => import("./views/account/verifyEmail"));

type TRouteDetails = {
  name: string;
  Icon: SvgIconComponent;
  element: JSX.Element;
  nav_hidden?: boolean;
};

const ROUTES: Record<TRoute, TRouteDetails> = {
  [TRoute.full_table]: {
    name: "Full Table",
    Icon: Home,
    element: <FullTable />,
  },
  [TRoute.individual_blends]: {
    name: "Price History",
    Icon: Timeline,
    element: <></>,
  },
  [TRoute.email_updates]: {
    name: "Notifications",
    Icon: Notifications,
    element: <></>,
  },
  [TRoute.my_account]: {
    name: "",
    Icon: AccountCircle,
    element: <Account />,
  },
  [TRoute.reset_password]: {
    name: "",
    Icon: Password,
    element: <ResetPassword />,
  },
  [TRoute.change_password]: {
    name: "",
    Icon: Password,
    element: <ChangePassword />,
  },
  [TRoute.error]: {
    name: "",
    Icon: ErrorIcon,
    element: <Error />,
  },
  [TRoute.verify_email]: {
    name: "",
    Icon: Email,
    element: <VerifyEmail />,
  },
};

export default ROUTES;
