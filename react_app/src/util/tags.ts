import { useQuery } from "@tanstack/react-query";
import { Dictionary, groupBy, isUndefined } from "lodash";
import { useMemo } from "react";
import { EMPTY_ARR } from "../consts";
import {
  getCategories,
  getTagToTags,
  getTags,
  getTobaccoToTags,
  getTobaccos,
} from "../protos/turbotin-Public_connectquery";
import {
  Category,
  Tag,
  TagToTag,
  Tobacco,
  TobaccoToTag,
} from "../protos/turbotin_pb";

export const useTags = (): {
  tobaccoTags: Map<number, Dictionary<string>>;
  tags: Tag[];
  cats: Category[];
  links: TobaccoToTag[];
  tagLinks: TagToTag[];
  tobaccos: Tobacco[];
} => {
  const { data: tags_ } = useQuery(getTags.useQuery());
  const { data: cats_ } = useQuery(getCategories.useQuery());
  const { data: links_ } = useQuery(getTobaccoToTags.useQuery());
  const { data: tagLinks_ } = useQuery(getTagToTags.useQuery());
  const { data: tobaccos_ } = useQuery(getTobaccos.useQuery());

  const tags = tags_?.items ?? EMPTY_ARR;
  const cats = cats_?.items ?? EMPTY_ARR;
  const links = links_?.items ?? EMPTY_ARR;
  const tagLinks = tagLinks_?.items ?? EMPTY_ARR;
  const tobaccos = tobaccos_?.items ?? EMPTY_ARR;

  const tagMap = useMemo(() => new Map(tags.map((t) => [t.id, t])), [tags]);
  const catMap = useMemo(() => new Map(cats.map((c) => [c.id, c])), [cats]);

  const tobaccoTags = useMemo((): Map<number, Dictionary<string>> => {
    const groups = groupBy(tagLinks, (t) => t.parentTagId);
    const result = new Map<number, Dictionary<string>>();
    for (const link of links) {
      const dict: Dictionary<string> = {};
      result.set(link.tobaccoId, dict);
      const tagIds = [
        link.tagId,
        ...(groups[link.tagId]?.map((l) => l.tagId) ?? []),
      ];

      for (const id of tagIds) {
        const tag = tagMap.get(id);
        if (isUndefined(tag)) continue;
        const cat = catMap.get(tag.categoryId);
        if (isUndefined(cat)) continue;
        dict[cat.name] = tag.value;
      }
    }
    return result;
  }, [catMap, links, tagLinks, tagMap]);

  return { tobaccoTags, tags, cats, links, tagLinks, tobaccos };
};
