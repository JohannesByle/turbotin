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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";
import { GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity";
import { useQuery } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import { fromPairs, isEmpty, isString } from "lodash";
import React, { useDeferredValue, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EMPTY_ARR,
  KebapMenu,
  MS_PER_SECOND,
  STORE_TO_NAME,
  TRoute,
} from "../../consts";
import { todaysTobaccos } from "../../protos/turbotin-Public_connectquery";
import { ObsTobacco } from "../../protos/turbotin_pb";
import { ActionMenu, TAction } from "../../util/actions";
import BoldSubStr from "../../util/components/boldSubStr";
import { useTags } from "../../util/tags";
import {
  FILTER_COL,
  FILTER_FIELD,
  TFilter,
  calcFilterModel,
} from "./filterUtil";
import Filters from "./filters";
import { TRow, price } from "./util";

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
  const { data, isFetching } = useQuery(todaysTobaccos.useQuery({}));
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

  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down("md"));
  const isDesktop = useMediaQuery(breakpoints.up("xl"));
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
      tobaccos.map((t) => ({ ...t, tags: tobaccoTags.get(t.tobaccoId) ?? {} })),
    [tobaccos, tobaccoTags]
  );

  const columns: Array<GridColDef<TRow>> = useMemo(
    () => [
      FILTER_COL,
      {
        field: "store" satisfies keyof ObsTobacco,
        flex: 1,
        headerName: "Store",
        hideable: false,
        valueGetter: ({ row }) => STORE_TO_NAME[row.store],
      },
      {
        field: "item" satisfies keyof ObsTobacco,
        flex: 3,
        headerName: "Name",
        renderCell: ({ row: { item, link } }) => (
          <a href={link} target={"_blank"} rel={"noreferrer"}>
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
        valueGetter: ({ row }) => price(row),
        renderCell: ({ row }) => row.priceStr,
        type: "number",
      },
      {
        field: "time" satisfies keyof ObsTobacco,
        flex: 1,
        headerName: "Last updated",
        valueGetter: ({ row: { time } }) =>
          dayjs((Number(time?.seconds) ?? 0) * MS_PER_SECOND),
        valueFormatter: ({ value }) => (value as Dayjs).fromNow(),
        hideable: false,
      },
      {
        field: "inStock" satisfies keyof ObsTobacco,
        width: 40,
        headerName: "",
        hideable: false,
        renderCell: ({ row }) =>
          row.inStock ? (
            <></>
          ) : (
            <Tooltip title="Out of stock">
              <ProductionQuantityLimits color="error" />
            </Tooltip>
          ),
      },

      ...cats.map(
        (c): GridColDef<TRow> => ({
          field: String(c.id),
          valueGetter: ({ row }) => row.tags[c.name],
          headerName: c.name,
        })
      ),
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
        f: () => navigate(TRoute.individual_blends),
        title: "Price history",
        icon: <Timeline />,
      },
    ],
    [navigate]
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
        sx={{ width: "100%", height: "100%", background: "white" }}
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
