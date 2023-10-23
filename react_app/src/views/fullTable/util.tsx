import { isUndefined } from "lodash";
import { ObsTobacco } from "../../protos/turbotin_pb";

export const NUMBER_REGEX = /(\d+.\d+)/;

export function price(t: ObsTobacco): number {
  const match = t.priceStr.match(NUMBER_REGEX)?.[0];
  return isUndefined(match) ? NaN : parseInt(match);
}
