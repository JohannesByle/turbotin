import {
  Check,
  Delete,
  Edit,
  Email,
  Logout,
  Warning,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Tooltip,
  useTheme,
} from "@mui/material";
import { isNull } from "lodash";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TRoute } from "../../consts";
import { AuthService } from "../../service";
import { ignoreCancel, usePromisify } from "../../util/promisify";
import { UserContext } from "../../util/userContext";
import EditPasswordDlg from "./editPasswordDlg";
import ConfirmationDlg from "../../util/components/confirmationDlg";

const Account = (): JSX.Element => {
  const user = useContext(UserContext);
  const [passwordDlg, showPasswordDlg] = usePromisify({ Dlg: EditPasswordDlg });
  const [confirmDeleteDlg, showConfirmDeleteDlg] = usePromisify({
    Dlg: ConfirmationDlg,
    defaultProps: {
      body: "This cannot be undone",
      submitMsg: "Delete",
      title: "Delete account?",
    },
  });
  const { palette } = useTheme();
  const navigate = useNavigate();

  if (isNull(user)) return <></>;
  const items: Array<[JSX.Element, JSX.Element]> = [
    [
      <Email key={0} />,
      <>
        {user.email}
        {user.email_verified ? (
          <Tooltip title={"Email verified"}>
            <IconButton>
              <Check color={"success"} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title={"Email not verified!"}>
            <IconButton>
              <Warning color={"error"} />
            </IconButton>
          </Tooltip>
        )}
      </>,
    ],
    [
      <IconButton key={0} onClick={() => void showPasswordDlg()}>
        <Edit sx={{ color: palette.primary.contrastText }} />
      </IconButton>,
      <>Password</>,
    ],
    [
      <IconButton
        key={0}
        onClick={() =>
          void AuthService.getAuthLogout().then(() => {
            void AuthService.postAuthGetCurrentUser().catch(() => null);
            navigate(TRoute.full_table);
          })
        }
      >
        <Logout sx={{ color: palette.primary.contrastText }} />
      </IconButton>,
      <>Logout</>,
    ],
    [
      <IconButton
        key={0}
        onClick={() =>
          void showConfirmDeleteDlg().then(async () => {
            await AuthService.getAuthDeleteAccount().catch(ignoreCancel);
            await AuthService.postAuthGetCurrentUser().catch(() => null);
            navigate(TRoute.full_table);
          })
        }
      >
        <Delete sx={{ color: palette.primary.contrastText }} />
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
