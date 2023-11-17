import { Dictionary, isUndefined } from "lodash";
import { ObsTobacco } from "../../protos/turbotin_pb";
import { PlainMessage } from "@bufbuild/protobuf";

export const NUMBER_REGEX = /(\d+.\d+)/;

export function price(t: TRow): number {
  const match = t.priceStr.match(NUMBER_REGEX)?.[0];
  return isUndefined(match) ? NaN : parseInt(match);
}

export type TRow = PlainMessage<ObsTobacco> & { tags: Dictionary<string> };
