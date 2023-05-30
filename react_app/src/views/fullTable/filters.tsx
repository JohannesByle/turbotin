import { Search } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Slider,
  TextField,
} from "@mui/material";
import { isArray, isEmpty, isString, uniq } from "lodash";
import React, { useMemo } from "react";
import { ObsTobacco } from "../../service";
import { TSetState, formatUSD } from "../../util";
import { TFilter } from "./filterUtil";

type TProps = {
  rows: ObsTobacco[];
  filter: TFilter;
  setFilter: TSetState<TFilter>;
};

const MAX_PRICE = 50;
const MIN_PRICE = 0;

const Filters = (props: TProps): JSX.Element => {
  const { filter, setFilter, rows } = props;

  const stores = useMemo(
    () => uniq(rows.map(({ store }) => store).filter(isString)),
    [rows]
  );

  return (
    <FormControl sx={{ width: "300px" }}>
      <TextField
        sx={{ backgroundColor: "white" }}
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
      <Autocomplete
        multiple
        options={stores}
        value={[...(filter.stores ?? [])]}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{ backgroundColor: "white", width: "100%" }}
          />
        )}
        onChange={(_, stores) =>
          setFilter((prev) => ({
            ...prev,
            stores: isEmpty(stores) ? undefined : new Set(stores),
          }))
        }
        limitTags={1}
      />
    </FormControl>
  );
};

export default Filters;
