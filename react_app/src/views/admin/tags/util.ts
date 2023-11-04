import { Dictionary, NumericDictionary, isUndefined, sortBy } from "lodash";
import { Category, Tag, TagToTag } from "../../../protos/turbotin_pb";

export function getChildren(
  cat: Category,
  catMap: Map<number, Category>,
  tagMap: Map<number, Tag>,
  links: TagToTag[]
): Category[] {
  const result = new Set<Category>();
  for (const link of links) {
    const parent = tagMap.get(link.parentTagId);
    const tag = tagMap.get(link.tagId);
    if (isUndefined(tag) || isUndefined(parent)) continue;
    const parentCat = catMap.get(parent.categoryId);
    if (parentCat?.id !== cat.id) continue;
    const c = catMap.get(tag.categoryId);
    if (!isUndefined(c)) result.add(c);
  }
  return [...result];
}

export function getDerivedTag(
  tag: Tag,
  cat: Category,
  catMap: Map<number, Category>,
  linkMap: Dictionary<TagToTag[]>,
  tagMap: Map<number, Tag>
): Tag | undefined {
  const links = linkMap[tag.id];
  if (isUndefined(links)) return;
  for (const link of links) {
    const t = tagMap.get(link.tagId);
    const c = catMap.get(t?.categoryId ?? NaN);
    if (c === cat) return tagMap.get(link.tagId);
  }
}

export function getValidCats(
  cat: Category,
  catMap: Map<number, Category>,
  tagMap: Map<number, Tag>,
  links: TagToTag[]
): Category[] {
  const result = new Array<Category>();
  for (const c of catMap.values())
    if (!getChildren(c, catMap, tagMap, links).includes(cat)) result.push(c);
  return sortBy(result, (c) => c.id !== cat.id);
}

export type TRow = NumericDictionary<Tag> & { id: number };

export const NULL_CAT = new Category();
export const OPERATOR = "contains";
