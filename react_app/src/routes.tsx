import {
  AccountCircle,
  Home,
  Notifications,
  SvgIconComponent,
  Timeline,
} from "@mui/icons-material";
import { TRoute } from "./consts";
import React from "react";
import Account from "./views/account/account";

type TRouteDetails = {
  name: string;
  Icon: SvgIconComponent;
  element: JSX.Element;
};

const ROUTES: Record<string, TRouteDetails> = {
  [TRoute.full_table]: {
    name: "Full Table",
    Icon: Home,
    element: <></>,
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
};

export default ROUTES;
