import { useQuery } from "@connectrpc/connect-query";
import { useMediaQuery } from "@mui/material";
import { isString, isUndefined, last, values } from "lodash";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { THEME, TRoute } from "../consts";
import { getCurrentUser } from "../protos/turbotin-Auth_connectquery";
import { User } from "../protos/turbotin_pb";

export type TSetState<T> = Dispatch<SetStateAction<T>>;

export const timeout = async (ms: number): Promise<void> =>
  await new Promise((resolve) => setTimeout(resolve, ms));

const USD_FORMAT = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
export const formatUSD = (v: number): string => USD_FORMAT.format(v);

export const useUser = (): User => {
  const { data: user } = useQuery(getCurrentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (isUndefined(user)) navigate(TRoute.full_table);
  }, [user, navigate]);

  return user ?? new User();
};

export const arrayOf = <T>(t: T): Array<T[keyof T]> => {
  const arr = values(t) as Array<T[keyof T]>;
  return isString(last(arr)) ? arr : arr.slice(arr.length / 2, arr.length);
};

export const basePath = (str: string): string => String(str.split("/")[1]);

export const useScreenSize = (): { isMobile: boolean; isDesktop: boolean } => {
  const { breakpoints } = THEME;

  const isMobile = useMediaQuery(breakpoints.down("md"));
  const isDesktop = useMediaQuery(breakpoints.up("xl"));

  return { isMobile, isDesktop };
};
