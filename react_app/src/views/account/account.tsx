import {
  createConnectQueryKey,
  useMutation,
  useQuery,
} from "@connectrpc/connect-query";
import { Delete, Edit, Email, Logout, Warning } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Tooltip,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import cookie from "cookie";
import { isUndefined } from "lodash";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { JWT_KEY, PALETTE, TRoute } from "../../consts";
import * as auth from "../../protos/turbotin-Auth_connectquery";
import ConfirmationDlg from "../../util/components/confirmationDlg";
import { usePromisify } from "../../util/promisify";
import EditPasswordDlg from "./editPasswordDlg";

const Account = (): JSX.Element => {
  const { data: user } = useQuery(auth.getCurrentUser);
  const { mutateAsync: deleteUser, isPending: isDeleting } = useMutation(
    auth.deleteUser
  );

  const [passwordDlg, showPasswordDlg] = usePromisify(EditPasswordDlg);
  const [confirmDeleteDlg, showConfirmDeleteDlg] =
    usePromisify(ConfirmationDlg);
  const navigate = useNavigate();

  const client = useQueryClient();

  if (isUndefined(user)) return <></>;
  if (user.email === "") return <Navigate to={TRoute.full_table} />;

  const items: Array<[JSX.Element, JSX.Element]> = [
    [
      <Email key={0} />,
      <>
        {user.email}
        {user.emailVerified || (
          <Tooltip title={"Email not verified!"}>
            <IconButton>
              <Warning color={"error"} />
            </IconButton>
          </Tooltip>
        )}
      </>,
    ],
    [
      <IconButton key={0} onClick={() => void showPasswordDlg({})}>
        <Edit sx={{ color: PALETTE.primary.contrastText }} />
      </IconButton>,
      <>Password</>,
    ],
    [
      <IconButton
        key={0}
        onClick={async () => {
          document.cookie = cookie.serialize(JWT_KEY, "", {
            expires: new Date(),
            path: "/",
          });
          await client.invalidateQueries({
            queryKey: createConnectQueryKey(auth.getCurrentUser),
          });
          navigate(TRoute.full_table);
        }}
      >
        <Logout sx={{ color: PALETTE.primary.contrastText }} />
      </IconButton>,
      <>Logout</>,
    ],
    [
      <IconButton
        key={0}
        onClick={async () => {
          await showConfirmDeleteDlg({
            body: "This cannot be undone",
            submitMsg: "Delete",
            title: "Delete account?",
          });
          await deleteUser({});
          await client.invalidateQueries({
            queryKey: createConnectQueryKey(auth.getCurrentUser),
          });
          navigate(TRoute.full_table);
        }}
      >
        {isDeleting ? (
          <CircularProgress />
        ) : (
          <Delete sx={{ color: PALETTE.primary.contrastText }} />
        )}
      </IconButton>,
      <>Delete account</>,
    ],
  ];
  return (
    <Box
      sx={{
        maxWidth: "md",
        display: "flex",
        mx: "auto",
        padding: 5,
        justifyContent: "center",
      }}
    >
      {confirmDeleteDlg}
      {passwordDlg}
      <Card>
        <CardContent>
          <List sx={{}}>
            {items.map(([icon, body], i) => (
              <div key={i}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>{icon}</Avatar>
                  </ListItemAvatar>
                  {body}
                </ListItem>
                <Divider variant="inset" component="li" />
              </div>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Account;
