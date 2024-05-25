import {
  createConnectQueryKey,
  useMutation,
  useQuery,
} from "@connectrpc/connect-query";
import { FilterAlt, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { GridFilterModel, GridRowSelectionModel } from "@mui/x-data-grid";
import { useQueryClient } from "@tanstack/react-query";
import { groupBy, isNull, sortBy } from "lodash";
import React, { useMemo, useState } from "react";
import { EMPTY_ARR, PALETTE } from "../../../consts";
import * as admin from "../../../protos/turbotin-Admin_connectquery";
import {
  getCategories,
  getTagToTags,
  getTags,
  getTobaccoToTags,
  getTobaccos,
} from "../../../protos/turbotin-Public_connectquery";
import { Category, Tag, TobaccoToTag } from "../../../protos/turbotin_pb";
import TobaccoLinksGrid from "./tobaccoLinksGrid";
import { OPERATOR, getCats } from "./util";

const NAME = "Name";

const getOptionLabel = (t: Tag): string => t.value ?? "";
const getOptionKey = (t: Tag): string | number => t.id ?? "";
const renderInput = (params: AutocompleteRenderInputParams): JSX.Element => (
  <TextField
    {...params}
    label="Value"
    sx={{ backgroundColor: PALETTE.background.paper }}
  />
);

const TobaccoLinks = (): JSX.Element => {
  const { data: tags_ } = useQuery(getTags);
  const { data: cats_ } = useQuery(getCategories);
  const { data: links_ } = useQuery(getTobaccoToTags);
  const { data: tagLinks_ } = useQuery(getTagToTags);
  const { data: tobaccos_ } = useQuery(getTobaccos);

  const tags = tags_?.items ?? EMPTY_ARR;
  const cats = cats_?.items ?? EMPTY_ARR;
  const links = links_?.items ?? EMPTY_ARR;
  const tagLinks = tagLinks_?.items ?? EMPTY_ARR;
  const tobaccos = tobaccos_?.items ?? EMPTY_ARR;

  const [filterModel, setFilterModel] = useState<GridFilterModel>();
  const [tag_, setTag] = useState<Tag | null>(null);
  const [col, setCol] = useState<string>(NAME);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [cat_, setCat] = useState<Category>();

  const cat = cat_ ?? cats[0];
  const tag = tag_?.categoryId === cat?.id ? tag_ : null;

  const { mutateAsync: createTobaccoToTags } = useMutation(
    admin.createTobaccoToTags
  );
  const queryClient = useQueryClient();

  const tagMap = useMemo(() => new Map(tags.map((t) => [t.id, t])), [tags]);
  const catMap = useMemo(() => new Map(cats.map((c) => [c.id, c])), [cats]);
  const catValues = useMemo(() => groupBy(tags, (t) => t.categoryId), [tags]);

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
        <Box sx={{ mr: "auto" }} />
        <FormControl>
          <InputLabel>Edit</InputLabel>
          <Select
            value={cat?.name}
            label="Edit"
            onChange={(e) =>
              setCat(cats.find((c) => c.name === e.target.value))
            }
            sx={{ backgroundColor: PALETTE.background.paper, minWidth: 100 }}
          >
            {cats.map((c) => (
              <MenuItem key={c.name} value={c.name}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Autocomplete
          value={tag}
          options={sortBy(catValues[cat?.id] ?? [], (c) => c.value)}
          onChange={(e, value) => setTag(value)}
          renderInput={renderInput}
          getOptionLabel={getOptionLabel}
          getOptionKey={getOptionKey}
          openOnFocus
          sx={{ minWidth: 300 }}
        />
        <LoadingButton
          startIcon={<Save />}
          disabled={selectionModel.length === 0 || isNull(tag)}
          onClick={async (e) => {
            if (isNull(tag)) return;
            const items = selectionModel.map(
              (id) => new TobaccoToTag({ tagId: tag.id, tobaccoId: Number(id) })
            );
            await createTobaccoToTags({ items });
            await queryClient.invalidateQueries({
              queryKey: createConnectQueryKey(getTobaccoToTags),
            });
          }}
          loading={queryClient.isMutating() > 0}
        >
          Save{selectionModel.length === 0 ? "" : ` (${selectionModel.length})`}
        </LoadingButton>
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
          selectionModel={selectionModel}
          setSelectionModel={setSelectionModel}
        />
      </Box>
    </Box>
  );
};

export default TobaccoLinks;
