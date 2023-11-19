import { Search } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Slider,
  TextField,
} from "@mui/material";
import {
  groupBy,
  isArray,
  isEmpty,
  isUndefined,
  merge,
  toPairs,
  uniq,
} from "lodash";
import React, { useMemo } from "react";
import { NAME_TO_STORE, PALETTE, STORE_TO_NAME } from "../../consts";
import { Category, ObsTobacco, Tag } from "../../protos/turbotin_pb";
import { TSetState, formatUSD } from "../../util";
import { TFilter } from "./filterUtil";

type TProps = {
  rows: ObsTobacco[];
  filter: TFilter;
  setFilter: TSetState<TFilter>;
  catMap: Map<number, Category>;
  tags: Tag[];
};

const MAX_PRICE = 75;
const MIN_PRICE = 0;

const Filters = (props: TProps): JSX.Element => {
  const { filter, setFilter, rows, catMap, tags } = props;

  const tagGroups = useMemo(() => groupBy(tags, (t) => t.categoryId), [tags]);

  const stores = useMemo(
    () => uniq(rows.map((s) => STORE_TO_NAME[s.store])),
    [rows]
  );

  return (
    <FormControl sx={{ width: "300px" }}>
      <FormLabel sx={{ mb: 1 }}>Filters</FormLabel>
      <TextField
        sx={{ backgroundColor: PALETTE.background.paper }}
        label={"Name"}
        value={filter.item ?? ""}
        onChange={(e) => {
          const item = e.currentTarget.value;
          setFilter((prev) => ({ ...prev, item }));
        }}
        InputProps={{
          endAdornment: <Search color={"primary"} />,
        }}
      />
      <Box sx={{ pt: 2, px: 3 }}>
        <Slider
          value={[filter.minPrice ?? MIN_PRICE, filter.maxPrice ?? MAX_PRICE]}
          onChange={(_, value) => {
            if (!isArray(value)) return;
            const [min, max] = value;
            setFilter((prev) => ({
              ...prev,
              minPrice: min === MIN_PRICE ? undefined : min,
              maxPrice: max === MAX_PRICE ? undefined : max,
            }));
          }}
          valueLabelFormat={formatUSD}
          marks={[
            { value: MIN_PRICE, label: formatUSD(MIN_PRICE) },
            { value: MAX_PRICE, label: `${formatUSD(MAX_PRICE)}+` },
          ]}
          max={MAX_PRICE}
          min={MIN_PRICE}
          valueLabelDisplay="auto"
        />
      </Box>
      <FormControlLabel
        control={
          <Checkbox
            value={Boolean(filter.inStock)}
            onChange={(_, inStock) =>
              setFilter((prev) => ({ ...prev, inStock }))
            }
          />
        }
        label="In stock"
      />
      <FormControlLabel
        control={
          <Checkbox
            value={Boolean(filter.inStock)}
            onChange={(_, hasPrice) =>
              setFilter((prev) => ({ ...prev, hasPrice }))
            }
          />
        }
        label="Has price"
      />
      <Autocomplete
        multiple
        options={stores}
        value={[...(filter.stores ?? [])].map((s) => STORE_TO_NAME[s])}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{ backgroundColor: PALETTE.background.paper, width: "100%" }}
            label="Store"
          />
        )}
        onChange={(_, stores) =>
          setFilter((prev) => ({
            ...prev,
            stores: isEmpty(stores)
              ? undefined
              : new Set(stores.map((s) => NAME_TO_STORE[s])),
          }))
        }
        limitTags={1}
      />
      {toPairs(tagGroups).map(([id, tags]) => {
        const cat = catMap.get(Number(id));
        if (isUndefined(cat)) return <></>;
        return (
          <Autocomplete
            key={id}
            options={tags.map((t) => t.value)}
            value={filter.tags[cat.name] ?? null}
            onChange={(_, v) =>
              setFilter((prev) => merge({}, prev, { tags: { [cat.name]: v } }))
            }
            sx={{ backgroundColor: PALETTE.background.paper, mt: 1 }}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  backgroundColor: PALETTE.background.paper,
                  width: "100%",
                }}
                label={cat.name}
              />
            )}
          />
        );
      })}
    </FormControl>
  );
};

export default Filters;
