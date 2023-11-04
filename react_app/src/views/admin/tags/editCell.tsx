import {
  Autocomplete,
  AutocompleteRenderInputParams,
  TextField,
} from "@mui/material";
import { GridRenderEditCellParams } from "@mui/x-data-grid";
import { Dictionary, sortBy } from "lodash";
import React, { SyntheticEvent, useCallback, useEffect, useRef } from "react";
import { Category, Tag } from "../../../protos/turbotin_pb";
import { TTagRow } from "./util";

type TProps = {
  params: GridRenderEditCellParams<TTagRow>;
  c: Category;
  catValues: Dictionary<Tag[]>;
};
const getOptionLabel = (t: Tag): string => t.value;
const renderInput = (params: AutocompleteRenderInputParams): JSX.Element => (
  <TextField {...params} label="" />
);

const TagEditCell = (props: TProps): JSX.Element => {
  const { c, catValues, params } = props;
  const { row, api, hasFocus } = params;

  const ref = useRef<HTMLElement>(null);

  const onChange = useCallback(
    (_: SyntheticEvent, value: Tag): void =>
      void api.setEditCellValue({ ...params, value }),
    [api, params]
  );

  useEffect(() => {
    if (hasFocus) {
      ref.current?.focus();
      ref.current?.click();
    }
  }, [hasFocus]);

  return (
    <Autocomplete
      ref={ref}
      value={row[c.id]}
      options={sortBy(catValues[c.id], (c) => c.value)}
      onChange={onChange}
      sx={{ border: 0, width: "100%" }}
      renderInput={renderInput}
      getOptionLabel={getOptionLabel}
      disableClearable
      openOnFocus
    />
  );
};

export default TagEditCell;
