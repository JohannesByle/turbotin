import { FilterAlt } from "@mui/icons-material";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { GridFilterModel } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { EMPTY_ARR, PALETTE } from "../../../consts";
import {
  getCategories,
  getTagToTags,
  getTags,
  getTobaccoToTags,
  getTobaccos,
} from "../../../protos/turbotin-Public_connectquery";
import TobaccoLinksGrid from "./tobaccoLinksGrid";
import { OPERATOR, getCats } from "./util";

const NAME = "Name";

const TobaccoLinks = (): JSX.Element => {
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

  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const [col, setCol] = useState<string>(NAME);

  const tagMap = useMemo(() => new Map(tags.map((t) => [t.id, t])), [tags]);
  const catMap = useMemo(() => new Map(cats.map((c) => [c.id, c])), [cats]);

  const children = getCats(catMap, tagMap, links);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}
    >
      <Box sx={{ mx: 2, mt: 2, display: "flex", gap: 1, alignItems: "center" }}>
        <FormControl>
          <InputLabel>Column</InputLabel>
          <Select
            value={col}
            label="Column"
            onChange={(e) => {
              setCol(e.target.value);
              setFilterModel({ items: [] });
            }}
            sx={{ backgroundColor: PALETTE.background.paper }}
          >
            <MenuItem value={NAME}>{NAME}</MenuItem>
            {children.map((c) => (
              <MenuItem key={c.name} value={c.name}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Filter"
          sx={{ backgroundColor: PALETTE.background.paper }}
          value={String(filterModel?.items?.[0]?.value ?? "")}
          onChange={(e) =>
            setFilterModel({
              items: [
                {
                  field:
                    col === NAME
                      ? col
                      : String(children.find((c) => c.name === col)?.id),
                  operator: OPERATOR,
                  value: e.target.value,
                },
              ],
            })
          }
          InputProps={{
            endAdornment: <FilterAlt sx={{ color: PALETTE.text.disabled }} />,
          }}
        />
      </Box>
      <Box sx={{ flex: 1, height: "100%", minWidth: 0, p: 2, minHeight: 0 }}>
        <TobaccoLinksGrid
          catMap={catMap}
          links={links}
          tagMap={tagMap}
          tags={tags}
          filterModel={filterModel}
          tagLinks={tagLinks}
          tobaccos={tobaccos}
        />
      </Box>
    </Box>
  );
};

export default TobaccoLinks;
