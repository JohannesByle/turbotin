import { NumericDictionary, isUndefined } from "lodash";
import {
  Category,
  Tag,
  TagToTag,
  Tobacco,
  TobaccoToTag,
} from "../../../protos/turbotin_pb";

export function getCats(
  catMap: Map<number, Category>,
  tagMap: Map<number, Tag>,
  links: TobaccoToTag[]
): Category[] {
  const result = new Set<Category>();
  for (const link of links) {
    const tag = tagMap.get(link.tagId);
    if (isUndefined(tag)) continue;
    const c = catMap.get(tag.categoryId);
    if (!isUndefined(c)) result.add(c);
  }
  return [...result];
}

export function getValidCats(
  catMap: Map<number, Category>,
  tagMap: Map<number, Tag>,
  links: TagToTag[]
): Category[] {
  const result = new Set<Category>(catMap.values());
  for (const link of links) {
    const tag = tagMap.get(link.tagId);
    if (isUndefined(tag)) continue;
    const c = catMap.get(tag.categoryId);
    if (!isUndefined(c)) result.delete(c);
  }

  return [...result];
}

export type TRow = NumericDictionary<Tag> & { tobacco: Tobacco };

export const NULL_CAT = new Category();
export const OPERATOR = "contains";
