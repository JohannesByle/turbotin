import {
  Autocomplete,
  AutocompleteRenderInputParams,
  TextField,
} from "@mui/material";
import { GridRenderEditCellParams } from "@mui/x-data-grid";
import { Dictionary, NumericDictionary, sortBy } from "lodash";
import React, { SyntheticEvent, useCallback, useEffect, useRef } from "react";
import { Category, Tag } from "../../protos/turbotin_pb";

type TProps = {
  params: GridRenderEditCellParams<NumericDictionary<Tag>>;
  c: Category;
  catValues: Dictionary<Tag[]>;
};
const getOptionLabel = (t: Tag): string => t.value ?? "";
const renderInput = (params: AutocompleteRenderInputParams): JSX.Element => (
  <TextField {...params} label="" />
);

const TagEditCell = (props: TProps): JSX.Element => {
  const { c, catValues, params } = props;
  const { row, api, hasFocus } = params;

  const ref = useRef<HTMLElement>(null);

  const onChange = useCallback(
    async (_: SyntheticEvent, value: Tag) => {
      await api.setEditCellValue({ ...params, value });
      api.stopCellEditMode({ id: params.id, field: params.field });
    },
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
      value={row[c.id] ?? null}
      options={sortBy(catValues[c.id], (c) => c.value)}
      onChange={onChange}
      sx={{ border: 0, width: "100%" }}
      renderInput={renderInput}
      getOptionLabel={getOptionLabel}
      openOnFocus
    />
  );
};

export default TagEditCell;
