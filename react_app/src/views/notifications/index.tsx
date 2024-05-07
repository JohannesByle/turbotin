import { PlainMessage } from "@bufbuild/protobuf";
import { Add, AddCircle, Block, Clear, Edit } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderEditCellParams,
} from "@mui/x-data-grid";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQuery,
  useMutation,
  createConnectQueryKey,
} from "@connectrpc/connect-query";
import { isUndefined } from "lodash";
import React, {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ALL_STORES,
  EMPTY_ARR,
  ICON_COL_PROPS,
  PALETTE,
  STORE_TO_NAME,
  voidFn,
} from "../../consts";
import * as svc from "../../protos/turbotin-Notifications_connectquery";
import { getNotifications } from "../../protos/turbotin-Notifications_connectquery";
import { Notification, Store, Tag } from "../../protos/turbotin_pb";
import { formatUSD } from "../../util";
import BlendSelect from "../../util/components/blendSelect";
import { useTags } from "../../util/tags";

const getStores = (row: PlainMessage<Notification>): Store[] => {
  const str = row.stores.length > 0 ? row.stores : JSON.stringify([]);
  return JSON.parse(String(str)) as Store[];
};

const EditCell = (params: GridRenderEditCellParams<TRow>): JSX.Element => {
  const { row, api, hasFocus } = params;

  const ref = useRef<HTMLElement>(null);

  const onChange = useCallback(
    async (_: SyntheticEvent, value: number[]) => {
      await api.setEditCellValue({ ...params, value: JSON.stringify(value) });
      api.stopCellEditMode({ id: params.id, field: params.field });
    },
    [api, params]
  );

  useEffect(() => {
    if (hasFocus) {
      ref.current?.focus();
      ref.current?.click();
      ref.current?.click();
    }
  }, [hasFocus]);

  const stores = getStores(row);
  return (
    <Autocomplete
      ref={ref}
      options={ALL_STORES}
      multiple
      value={stores}
      renderInput={(params) => <TextField {...params} />}
      sx={{ border: 0, width: "100%" }}
      onChange={onChange}
      getOptionLabel={(s: Store) => STORE_TO_NAME[s]}
    />
  );
};

type TRow = PlainMessage<Notification> & {
  tag: Tag;
};

const Notifications = (): JSX.Element => {
  const { data, isFetching } = useQuery(getNotifications);
  const queryClient = useQueryClient();
  const onSettled = (): void =>
    void queryClient.invalidateQueries({
      queryKey: createConnectQueryKey(getNotifications),
    });
  const { mutateAsync: createNotification, isPending: isCreating } =
    useMutation(svc.createNotification, { onSettled });
  const { mutateAsync: updateNotification, isPending: isUpdating } =
    useMutation(svc.updateNotification, { onSettled });
  const { mutateAsync: deleteNotifications, isPending: isDeleting } =
    useMutation(svc.deleteNotifications, { onSettled });

  const { tagMap } = useTags();
  const [tag, setTag] = useState<Tag>();
  const notifications = data?.items ?? EMPTY_ARR;

  const isInvalid = notifications.some((n) => n.tagId === tag?.id);

  const rows = useMemo(
    () =>
      notifications.map(
        (n): TRow => ({ ...n, tag: tagMap.get(n.tagId) ?? new Tag() })
      ),
    [notifications, tagMap]
  );

  const columns = useMemo(
    (): Array<GridColDef<TRow>> => [
      {
        field: "name",
        headerName: "Name",
        valueGetter: (_, row) => row.tag.value,
        flex: 1,
      },
      {
        field: "stores" satisfies keyof TRow,
        headerName: "Stores",
        renderCell: ({ row, api, field, id }) => {
          const stores = getStores(row);
          if (stores.length === 0)
            return (
              <Tooltip title="Edit stores">
                <IconButton
                  onClick={() => api.startCellEditMode({ field, id })}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            );
          return stores.map((v) => <Chip key={v} label={STORE_TO_NAME[v]} />);
        },
        editable: true,
        renderEditCell: (params) => <EditCell {...params} />,
        flex: 1,
      },
      {
        field: "excludeStores" satisfies keyof TRow,
        renderCell: ({ row }) => {
          if (getStores(row).length === 0) return <></>;
          return (
            <Tooltip
              title={`${row.excludeStores ? "Excluding" : "Including"} stores`}
            >
              <IconButton
                onClick={() =>
                  void updateNotification({
                    ...row,
                    excludeStores: !row.excludeStores,
                  })
                }
              >
                {row.excludeStores ? <Block /> : <AddCircle />}
              </IconButton>
            </Tooltip>
          );
        },
        ...ICON_COL_PROPS,
      },
      {
        field: "maxPrice" satisfies keyof TRow,
        headerName: "Max price",
        type: "number",
        valueFormatter: ({ value }) =>
          value > 0 ? formatUSD(Number(value)) : "",
        editable: true,
        flex: 1,
      },
      {
        field: "delete",
        renderCell: ({ row }) => (
          <Tooltip title={"Delete notification"}>
            <IconButton
              onClick={() => void deleteNotifications({ items: [row.id] })}
            >
              <Clear />
            </IconButton>
          </Tooltip>
        ),
        ...ICON_COL_PROPS,
      },
    ],
    [updateNotification, deleteNotifications]
  );

  return (
    <Box
      sx={{
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Box
        maxWidth={"lg"}
        sx={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          m: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <BlendSelect tag={tag} setTag={setTag} />
          <Tooltip
            title={
              isUndefined(tag)
                ? "No blend selected"
                : isInvalid
                ? "Blend already selected"
                : false
            }
          >
            <div>
              <Button
                variant="contained"
                startIcon={<Add />}
                disabled={isUndefined(tag) || isInvalid}
                onClick={async () => {
                  if (!isUndefined(tag)) {
                    await createNotification({ tagId: tag.id });
                    setTag(undefined);
                  }
                }}
              >
                Add Notification
              </Button>
            </div>
          </Tooltip>
        </Box>
        <DataGrid
          rows={rows}
          columns={columns}
          sx={{ backgroundColor: PALETTE.background.paper, m: 1 }}
          autoHeight
          loading={isFetching || isCreating || isUpdating || isDeleting}
          processRowUpdate={async (newRow) => {
            await updateNotification(newRow).catch(voidFn);
            return newRow;
          }}
        />
      </Box>
    </Box>
  );
};

export default Notifications;
