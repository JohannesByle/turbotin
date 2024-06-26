import { useQuery } from "@connectrpc/connect-query";
import { groupBy, isUndefined } from "lodash";
import { useMemo } from "react";
import { EMPTY_ARR } from "../consts";
import {
  getAllTagData,
  getTobaccos,
} from "../protos/turbotin-Public_connectquery";
import {
  AllTagData,
  Category,
  Tag,
  TagToTag,
  Tobacco,
  TobaccoToTag,
} from "../protos/turbotin_pb";

export const useTags = (): {
  tobaccoTags: Map<number, Tag[]>;
  tags: Tag[];
  cats: Category[];
  links: TobaccoToTag[];
  tagLinks: TagToTag[];
  tobaccos: Tobacco[];
  isFetching: boolean;
  tagMap: Map<number, Tag>;
  catMap: Map<number, Category>;
} => {
  const { data: tobaccos_, isFetching: isFetchingTobaccos } =
    useQuery(getTobaccos);
  const { data, isFetching } = useQuery(getAllTagData);
  const {
    links = EMPTY_ARR,
    cats = EMPTY_ARR,
    tags = EMPTY_ARR,
    tagLinks = EMPTY_ARR,
  } = data ?? new AllTagData();

  const tobaccos = tobaccos_?.items ?? EMPTY_ARR;

  const tagMap = useMemo(() => new Map(tags.map((t) => [t.id, t])), [tags]);
  const catMap = useMemo(() => new Map(cats.map((c) => [c.id, c])), [cats]);

  const tobaccoTags = useMemo((): Map<number, Tag[]> => {
    const groups = groupBy(tagLinks, (t) => t.parentTagId);
    const result = new Map<number, Tag[]>();
    for (const link of links) {
      let arr = result.get(link.tobaccoId);
      if (isUndefined(arr)) {
        arr = new Array<Tag>();
        result.set(link.tobaccoId, arr);
      }
      const tagIds = [
        link.tagId,
        ...(groups[link.tagId]?.map((l) => l.tagId) ?? []),
      ];
      for (const id of tagIds) {
        const tag = tagMap.get(id);
        if (isUndefined(tag)) continue;
        const cat = catMap.get(tag.categoryId);
        if (isUndefined(cat)) continue;
        arr.push(tag);
      }
    }
    return result;
  }, [catMap, links, tagLinks, tagMap]);

  return {
    tobaccoTags,
    tags,
    cats,
    links,
    tagLinks,
    tobaccos,
    isFetching: isFetching || isFetchingTobaccos,
    tagMap,
    catMap,
  };
};
