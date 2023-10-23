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
import React from "react";
import { TRoute } from "./consts";
import Account from "./views/account/account";
import ChangePassword from "./views/auth/changePassword";
import ResetPassword from "./views/auth/resetPassword";
import Error from "./views/error";
import FullTable from "./views/fullTable";
import VerifyEmail from "./views/account/verifyEmail";

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
