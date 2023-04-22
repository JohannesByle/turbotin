import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useTheme,
} from "@mui/material";
import { AxiosError } from "axios";
import { StatusCodes } from "http-status-codes";
import React, { useCallback, useContext, useState } from "react";
import { AuthService } from "../../service";
import LoadingButton from "../../util/components/LoadingButton";
import { TDlgProps, ignoreCancel } from "../../util/promisify";
import { UserContext } from "../../util/userContext";
import PasswordEdit from "../auth/passwordEdit";

const EditPasswordDlg = (props: TDlgProps): JSX.Element => {
  const { onCancel, onSubmit, open } = props;
  const user = useContext(UserContext);
  const [oldPassword, setOldPassword_] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [error, setError] = useState<string | undefined>(undefined);
  const { palette } = useTheme();

  const setOldPassword: typeof setOldPassword_ = useCallback((password) => {
    setOldPassword_(password);
    setError(undefined);
  }, []);

  if (user === null) return <></>;
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle sx={{ color: palette.text.secondary }}>
        Change password
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          value={user.email}
          sx={{ display: "none" }}
          autoComplete={"username"}
        />
        <PasswordEdit
          password={oldPassword}
          setPassword={setOldPassword}
          hideErrors
          label={"Old Password"}
          customError={error}
        />
        <PasswordEdit
          password={newPassword}
          setPassword={setNewPassword}
          label={"New Password"}
          autoComplete={"new-password"}
        />
      </DialogContent>
      <DialogActions>
        <LoadingButton
          onClick={async () =>
            await AuthService.postAuthChangePassword({
              new_password: newPassword,
              old_password: oldPassword,
            })
              .then(() => onSubmit())
              .catch((e: AxiosError) => {
                if (e.status === StatusCodes.CONFLICT)
                  setError("Incorrect password");
                else ignoreCancel(e);
              })
          }
          variant={"contained"}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditPasswordDlg;
