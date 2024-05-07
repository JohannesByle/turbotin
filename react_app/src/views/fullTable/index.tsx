import { useQuery } from "@connectrpc/connect-query";
import { ProductionQuantityLimits, Timeline } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";
import { GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity";
import dayjs, { Dayjs } from "dayjs";
import { fromPairs, isEmpty, isString, isUndefined } from "lodash";
import React, { useDeferredValue, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BLEND,
  EMPTY_ARR,
  ICON_COL_PROPS,
  INDIVIDUAL_BLENDS,
  KebapMenu,
  MS_PER_SECOND,
  PALETTE,
  STORE_TO_NAME,
} from "../../consts";
import { todaysTobaccos } from "../../protos/turbotin-Public_connectquery";
import { ObsTobacco } from "../../protos/turbotin_pb";
import { useScreenSize } from "../../util";
import { ActionMenu, TAction } from "../../util/actions";
import BoldSubStr from "../../util/components/boldSubStr";
import { useTags } from "../../util/tags";
import Filters from "./filters";
import {
  calcFilterModel,
  FILTER_COL,
  FILTER_FIELD,
  TFilter,
} from "./filterUtil";
import { price, TRow } from "./util";

type TColVisibilityModel = Partial<
  Record<keyof ObsTobacco | typeof FILTER_FIELD | "price" | "kebap", boolean>
>;

const MOBILE_COLS: TColVisibilityModel = {
  [FILTER_FIELD]: false,
  store: true,
  item: true,
  price: true,
  inStock: false,
  time: false,
  kebap: false,
};
const DESKTOP_COLS: TColVisibilityModel = {
  [FILTER_FIELD]: false,
  store: true,
  item: true,
  price: true,
  inStock: true,
  time: true,
  kebap: true,
};

function getRowId(row: TRow): number {
  return row.tobaccoId;
}

const INITIAL_STATE: GridInitialStateCommunity = {
  pagination: {
    paginationModel: { pageSize: 50, page: 0 },
  },
};

const FullTable = (): JSX.Element => {
  const { data, isFetching } = useQuery(todaysTobaccos);
  const tobaccos = data?.items ?? EMPTY_ARR;

  const [filter, setFilter] = useState<TFilter>({ tags: {} });
  const [menuRow, setMenuRow] = useState<TRow>();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [visibleTags, setVisibleTags] = useState<Set<number>>(new Set());
  const {
    tobaccoTags,
    cats,
    isFetching: isFetchingTags,
    catMap,
    tags,
  } = useTags();

  const { isDesktop, isMobile } = useScreenSize();

  const visibiltyModel = useMemo(
    (): GridColumnVisibilityModel => ({
      ...(isMobile ? MOBILE_COLS : DESKTOP_COLS),
      ...fromPairs(cats.map((c) => [String(c.id), visibleTags.has(c.id)])),
    }),
    [cats, isMobile, visibleTags]
  );

  const navigate = useNavigate();

  const filterModel = useMemo(() => calcFilterModel(filter), [filter]);
  const deferredFilterModel = useDeferredValue(filterModel);

  const rows = useMemo(
    (): TRow[] =>
      tobaccos.map((t) => {
        const tags = tobaccoTags.get(t.tobaccoId) ?? [];
        return {
          ...t,
          tags,
          tagValues: fromPairs(
            tags.map((t) => [catMap.get(t.categoryId)?.name, t.value])
          ),
        };
      }),
    [tobaccos, tobaccoTags, catMap]
  );

  const columns = useMemo(
    (): Array<GridColDef<TRow>> => [
      FILTER_COL,
      {
        field: "store" satisfies keyof ObsTobacco,
        flex: 1,
        headerName: "Store",
        hideable: false,
        valueFormatter: (_, row) => STORE_TO_NAME[row.store],
      },
      {
        field: "item" satisfies keyof ObsTobacco,
        flex: 2,
        headerName: "Name",
        renderCell: ({ row: { item, link } }) => (
          <a
            href={link}
            target={"_blank"}
            rel={"noreferrer"}
            style={{ textOverflow: "ellipsis", overflow: "hidden" }}
          >
            {!isString(filter.item) ||
            isEmpty(filter.item) ||
            !isString(item) ? (
              item
            ) : (
              <BoldSubStr str={item} subStr={filter.item} />
            )}
          </a>
        ),
        hideable: false,
      },
      {
        field: "price",
        flex: 1,
        headerName: "Price",
        hideable: false,
        valueGetter: (_, row) => price(row),
        renderCell: ({ row }) => row.priceStr,
        type: "number",
      },
      {
        field: "time" satisfies keyof ObsTobacco,
        flex: 0.5,
        headerName: "Last updated",
        valueGetter: (_, { time }) =>
          dayjs((Number(time?.seconds) ?? 0) * MS_PER_SECOND),
        valueFormatter: (value) => (value as Dayjs).fromNow(),
        hideable: false,
      },
      ...cats.map(
        (c): GridColDef<TRow> => ({
          field: String(c.id),
          valueGetter: (_, row) => row.tagValues[c.name],
          headerName: c.name,
          flex: 2,
        })
      ),
      {
        field: "inStock" satisfies keyof ObsTobacco,
        hideable: false,
        renderCell: ({ row }) =>
          row.inStock ? (
            <></>
          ) : (
            <Tooltip title="Out of stock">
              <ProductionQuantityLimits color="error" />
            </Tooltip>
          ),
        ...ICON_COL_PROPS,
      },
      {
        field: "kebap",
        width: 40,
        headerName: "",
        hideable: false,
        renderCell: ({ row }) => (
          <IconButton
            onClick={(e) => {
              setMenuRow(row);
              setAnchorEl(e.currentTarget);
            }}
          >
            <KebapMenu />
          </IconButton>
        ),
      },
    ],
    [cats, filter.item]
  );

  const actions = useMemo(
    (): TAction[] => [
      {
        f: () => {
          const blend = menuRow?.tagValues[BLEND];
          const tag = tags.find((t) => t.value === blend);
          if (!isUndefined(tag)) navigate(`${INDIVIDUAL_BLENDS}/${tag.id}`);
        },
        title: "Price history",
        icon: <Timeline />,
      },
    ],
    [navigate, menuRow, tags]
  );

  return (
    <Box
      sx={{
        p: isMobile ? 1 : 4,
        justifyContent: "center",
        width: "100%",
        height: "100%",
        display: "flex",
      }}
    >
      <ActionMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        actions={actions}
      />
      {isDesktop && (
        <>
          <Box
            sx={{
              width: "300px",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Filters
              filter={filter}
              setFilter={setFilter}
              rows={tobaccos}
              catMap={catMap}
              tags={tags}
            />
            <Divider flexItem sx={{ my: 1 }} />
            <FormControl sx={{ mt: 1 }} fullWidth>
              <FormLabel>Columns</FormLabel>
              {isFetchingTags ? (
                <CircularProgress sx={{ my: 2, mx: "auto" }} />
              ) : (
                <FormGroup>
                  {cats.map((c) => (
                    <FormControlLabel
                      key={c.id}
                      control={
                        <Checkbox
                          checked={visibleTags.has(c.id)}
                          onChange={() =>
                            setVisibleTags((prev) => {
                              const result = new Set(prev);
                              result.delete(c.id) || result.add(c.id);
                              return result;
                            })
                          }
                          name={c.name}
                        />
                      }
                      label={c.name}
                    />
                  ))}
                </FormGroup>
              )}
            </FormControl>
          </Box>
          <Divider flexItem orientation={"vertical"} sx={{ mx: 1 }} />
        </>
      )}
      <Box
        maxWidth={"lg"}
        sx={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          background: PALETTE.background.paper,
        }}
      >
        <DataGrid<TRow>
          columns={columns}
          rows={rows}
          loading={isFetching}
          density={"compact"}
          columnVisibilityModel={visibiltyModel}
          filterModel={deferredFilterModel}
          initialState={INITIAL_STATE}
          getRowId={getRowId}
          disableColumnFilter
          disableColumnSelector
          disableColumnMenu
          autoPageSize
        />
      </Box>
    </Box>
  );
};

export default FullTable;
