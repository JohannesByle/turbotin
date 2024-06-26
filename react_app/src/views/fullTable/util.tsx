import { PlainMessage } from "@bufbuild/protobuf";
import { Dictionary, isUndefined } from "lodash";
import { ObsTobacco, Tag } from "../../protos/turbotin_pb";

export const NUMBER_REGEX = /(\d+.\d+)/;

export function price(t: TRow): number {
  const match = t.priceStr.match(NUMBER_REGEX)?.[0];
  return isUndefined(match) ? Infinity : parseInt(match);
}

export type TRow = PlainMessage<ObsTobacco> & {
  tagValues: Dictionary<string>;
  tags: Tag[];
};
