import {
  createConnectQueryKey,
  useMutation,
  useQuery,
} from "@connectrpc/connect-query";
import { Add, FilterAlt } from "@mui/icons-material";
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { GridFilterModel } from "@mui/x-data-grid";
import { useQueryClient } from "@tanstack/react-query";
import { first, isString, isUndefined } from "lodash";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { EMPTY_ARR, PALETTE } from "../../../consts";
import * as admin from "../../../protos/turbotin-Admin_connectquery";
import {
  getCategories,
  getTags,
  getTagToTags,
} from "../../../protos/turbotin-Public_connectquery";
import LoadingIcon from "../../../util/components/loadingIcon";
import TagGrid from "./tagGrid";
import { getChildren, NULL_CAT, OPERATOR } from "./util";

const Tags = (): JSX.Element => {
  const { data: tags_ } = useQuery(getTags);
  const { data: cats_ } = useQuery(getCategories);
  const { data: links_ } = useQuery(getTagToTags);

  const tags = tags_?.items ?? EMPTY_ARR;
  const cats = cats_?.items ?? EMPTY_ARR;
  const links = links_?.items ?? EMPTY_ARR;

  const [filterModel, setFilterModel] = useState<GridFilterModel>();
  const [deleting, setDeleting] = useState<boolean>(false);

  const [cat_, setCat] = useState<number | undefined>();
  const [col_, setCol] = useState<string | undefined>();

  const newTagRef = useRef<HTMLInputElement>();

  const tagMap = useMemo(() => new Map(tags.map((t) => [t.id, t])), [tags]);
  const catMap = useMemo(() => new Map(cats.map((c) => [c.id, c])), [cats]);

  const { mutateAsync: createTag, isPending } = useMutation(admin.createTag);
  const queryClient = useQueryClient();

  const cat = cats.find((c) => c.id === cat_) ?? first(cats) ?? NULL_CAT;

  const children = getChildren(cat, catMap, tagMap, links);

  const col =
    isString(col_) && children.some((c) => c.name === col_) ? col_ : cat.name;

  const addTag = useCallback(async () => {
    const el = newTagRef.current;
    if (isUndefined(el)) return;
    const value = el.value;
    if (value.length === 0) return;
    await createTag({ value, categoryId: cat.id });
    el.value = "";
    await queryClient.invalidateQueries({
      queryKey: createConnectQueryKey(getTags),
    });
  }, [cat, createTag, queryClient]);

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
      <Tabs
        value={cat.id}
        onChange={(_, v: number) => {
          setCat(v);
          setFilterModel({ items: [] });
        }}
        sx={{ backgroundColor: PALETTE.background.paper }}
      >
        {cats.map((c) => (
          <Tab key={c.id} value={c.id} label={c.name} />
        ))}
      </Tabs>
      <Divider flexItem />
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
            {[cat, ...children].map((c) => (
              <MenuItem key={c.id} value={c.name}>
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
                  field: String(cats.find((c) => c.name === col)?.id),
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
        <FormControlLabel
          control={
            <Switch
              checked={deleting}
              onChange={(_, checked) => setDeleting(checked)}
              sx={{ ml: "auto" }}
            />
          }
          label="Delete mode"
          sx={{ color: PALETTE.text.secondary, ml: "auto" }}
        />
        <TextField
          inputRef={newTagRef}
          label={`Add ${cat.name}`}
          sx={{ backgroundColor: PALETTE.background.paper }}
          onKeyDown={(e) => {
            if (e.key === "Enter") void addTag();
          }}
        />
        <IconButton onClick={addTag} color="primary">
          {isPending ? <LoadingIcon /> : <Add />}
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, height: "100%", minWidth: 0, p: 2, minHeight: 0 }}>
        <TagGrid
          key={cat.id}
          cat={cat}
          catMap={catMap}
          links={links}
          tagMap={tagMap}
          tags={tags}
          filterModel={filterModel}
          deleting={deleting}
          setDeleting={setDeleting}
        />
      </Box>
    </Box>
  );
};

export default Tags;
