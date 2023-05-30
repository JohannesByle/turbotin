import { Box, Divider, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs, { Dayjs } from "dayjs";
import { isArray, isEmpty, isString } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { APP_BAR_HEIGHT } from "../../consts";
import { DataService, ObsTobacco } from "../../service";
import BoldSubStr from "../../util/components/boldSubStr";
import {
  FILTER_COL,
  FILTER_FIELD,
  TFilter,
  calcFilterModel,
  calcPrice,
} from "./filterUtil";
import Filters from "./filters";

type TColVisibilityModel = Partial<
  Record<keyof ObsTobacco | typeof FILTER_FIELD, boolean>
>;

const MOBILE_COLS: TColVisibilityModel = {
  [FILTER_FIELD]: false,
  store: true,
  item: true,
  price: true,
  stock: false,
  time: false,
};
const DESKTOP_COLS: TColVisibilityModel = {
  [FILTER_FIELD]: false,
  store: true,
  item: true,
  price: true,
  stock: true,
  time: true,
};

const FullTable = (): JSX.Element => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [tobaccos, setTobaccos] = useState<ObsTobacco[]>([]);
  const [filter, setFilter] = useState<TFilter>({});
  const { breakpoints } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down("md"));
  const isDesktop = useMediaQuery(breakpoints.up("xl"));
  const visibiltyModel = isMobile ? MOBILE_COLS : DESKTOP_COLS;

  const filterModel = useMemo(() => calcFilterModel(filter), [filter]);

  useEffect(() => {
    if (!loaded)
      void DataService.postDataCurrentTobaccos()
        .then((tobaccos) => isArray(tobaccos) && setTobaccos(tobaccos))
        .finally(() => setLoaded(true));
  }, [loaded]);

  return (
    <Box
      sx={{
        p: isMobile ? 1 : 4,
        justifyContent: "center",
        width: "100%",
        height: `calc(100vh - ${APP_BAR_HEIGHT})`,
        display: "flex",
      }}
    >
      {isDesktop && (
        <>
          <Filters filter={filter} setFilter={setFilter} rows={tobaccos} />
          <Divider flexItem orientation={"vertical"} sx={{ mx: 1 }} />
        </>
      )}
      <Box
        maxWidth={"lg"}
        sx={{ width: "100%", height: "100%", background: "white" }}
      >
        <DataGrid<ObsTobacco>
          columns={[
            FILTER_COL,
            {
              field: "store" satisfies keyof ObsTobacco,
              flex: 1,
              headerName: "Store",
              hideable: false,
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
              field: "stock" satisfies keyof ObsTobacco,
              flex: 1,
              headerName: "Status",
              hideable: false,
            },
            {
              field: "price" satisfies keyof ObsTobacco,
              flex: 1,
              valueGetter: ({ row }) => calcPrice(row),
              renderCell: ({ row: { price } }) => price,
              headerName: "Price",
              hideable: false,
            },
            {
              field: "time" satisfies keyof ObsTobacco,
              flex: 1,
              headerName: "Last updated",
              valueGetter: ({ row: { time } }) => dayjs(time),
              valueFormatter: ({ value }) => (value as Dayjs).fromNow(),
              hideable: false,
            },
          ]}
          rows={tobaccos}
          loading={!loaded}
          checkboxSelection={!isMobile}
          density={"compact"}
          columnVisibilityModel={visibiltyModel}
          filterModel={filterModel}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 50, page: 0 },
            },
          }}
          disableColumnFilter
          disableColumnSelector
          autoPageSize
        />
      </Box>
    </Box>
  );
};

export default FullTable;
