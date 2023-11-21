import { Autocomplete, TextField } from "@mui/material";
import { groupBy, isEqual, isUndefined, sortBy } from "lodash";
import React, { useMemo } from "react";
import { BLEND, BRAND, PALETTE } from "../../consts";
import { Tag } from "../../protos/turbotin_pb";
import { useTags } from "../tags";
import LoadingIcon from "./loadingIcon";

type TProps = {
  tag?: Tag;
  setTag: (tag: Tag) => void;
  isLoading?: boolean;
};

const getOptionLabel = (tag: Tag): string => tag?.value ?? "";

const BlendSelect = (props: TProps): JSX.Element => {
  const { tag, setTag, isLoading = false } = props;
  const { cats, tagMap, tagLinks, isFetching, links, tags } = useTags();

  const blend = cats.find((c) => c.name === BLEND);

  const getBrand = useMemo(() => {
    const groups = groupBy(tagLinks, (t) => t.parentTagId);
    const brand = cats.find((c) => c.name === BRAND);
    if (isUndefined(brand)) return () => "";
    return (tag: Tag): string => {
      const link = groups[tag.id]?.find(
        (l) => tagMap.get(l.tagId)?.categoryId === brand?.id
      );
      return tagMap.get(link?.tagId ?? NaN)?.value ?? "";
    };
  }, [cats, tagLinks, tagMap]);

  const blends = useMemo(() => {
    const linkedTags = new Set(links.map((l) => l.tagId));
    return sortBy(
      tags.filter((t) => t.categoryId === blend?.id && linkedTags.has(t.id)),
      [getBrand, (t) => t.value]
    );
  }, [tags, blend, getBrand, links]);

  return (
    <Autocomplete
      value={(tag ?? null) as Tag}
      options={blends}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{ backgroundColor: PALETTE.background.paper }}
          label="Blend"
          {...((isFetching || isLoading) && {
            InputProps: { endAdornment: <LoadingIcon /> },
          })}
        />
      )}
      getOptionLabel={getOptionLabel}
      groupBy={getBrand}
      sx={{ width: 300, m: 1 }}
      onChange={(_, tag) => setTag(tag)}
      isOptionEqualToValue={isEqual}
      disableClearable
    />
  );
};

export default BlendSelect;
