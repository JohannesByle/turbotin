import { useQuery } from "@tanstack/react-query";
import { Dictionary, isString, isUndefined, last, values } from "lodash";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TRoute } from "../consts";
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
  const { data: user } = useQuery(getCurrentUser.useQuery());
  const navigate = useNavigate();

  useEffect(() => {
    if (isUndefined(user)) navigate(TRoute.full_table);
  }, [user, navigate]);

  return user ?? new User();
};

export const arrayOf = <T extends string | number>(t: Dictionary<T>): T[] => {
  const arr = values(t);
  return isString(last(arr)) ? arr : arr.slice(arr.length / 2, arr.length);
};

export const basePath = (str: string): string => String(str.split("/")[1]);
