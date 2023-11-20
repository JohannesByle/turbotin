import { PlainMessage } from "@bufbuild/protobuf";
import { Add } from "@mui/icons-material";
import { Box, Button, Chip, Tooltip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isUndefined } from "lodash";
import React, { useMemo, useState } from "react";
import { EMPTY_ARR, PALETTE, STORE_TO_NAME } from "../../consts";
import * as svc from "../../protos/turbotin-Notifications_connectquery";
import { getNotifications } from "../../protos/turbotin-Notifications_connectquery";
import { Notification, Store, Tag } from "../../protos/turbotin_pb";
import BlendSelect from "../../util/components/blendSelect";
import { useTags } from "../../util/tags";

const COLUMNS: Array<GridColDef<TRow>> = [
  {
    field: "name",
    headerName: "Name",
    valueGetter: ({ row }) => row.tag.value,
    flex: 1,
  },
  {
    field: "allowedStores" satisfies keyof TRow,
    headerName: "Stores",
    renderCell: ({ value }) =>
      String(value).length > 0 ? (
        (JSON.parse(String(value)) as Store[]).map((v) => (
          <Chip key={v} label={STORE_TO_NAME[v]} />
        ))
      ) : (
        <></>
      ),
    flex: 1,
  },
  {
    field: "maxPrice" satisfies keyof TRow,
    headerName: "Max price",
    type: "number",
    valueFormatter: ({ value }) => (value > 0 ? Number(value) : ""),
    editable: true,
    flex: 1,
  },
];

type TRow = PlainMessage<Notification> & {
  tag: Tag;
};

const Notifications = (): JSX.Element => {
  const { data, isFetching } = useQuery(getNotifications.useQuery());
  const { mutateAsync: setNotifications, isLoading: isSaving } = useMutation(
    svc.setNotifications.useMutation()
  );
  const queryClient = useQueryClient();
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
                    await setNotifications({
                      items: [new Notification({ tagId: tag.id })],
                    });
                    setTag(undefined);
                    void queryClient.invalidateQueries({
                      queryKey: getNotifications.getQueryKey(),
                    });
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
          columns={COLUMNS}
          sx={{ backgroundColor: PALETTE.background.paper, m: 1 }}
          autoHeight
          loading={isFetching || isSaving}
        />
      </Box>
    </Box>
  );
};

export default Notifications;
