import { Dispatch, SetStateAction } from "react";

export type TSetState<T> = Dispatch<SetStateAction<T>>;

export const timeout = async (ms: number): Promise<void> =>
  await new Promise((resolve) => setTimeout(resolve, ms));

export const formatUSD = (v: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(v);
