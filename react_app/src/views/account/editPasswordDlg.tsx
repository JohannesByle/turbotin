import LoadingButton from "@mui/lab/LoadingButton";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { PALETTE } from "../../consts";
import * as auth from "../../protos/turbotin-Auth_connectquery";
import { useUser } from "../../util";
import { TDlgProps } from "../../util/promisify";
import PasswordEdit from "../auth/passwordEdit";

const EditPasswordDlg = (props: TDlgProps): JSX.Element => {
  const { onCancel, onSubmit, open } = props;
  const user = useUser();
  const [oldPassword, setOldPassword_] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [error, setError] = useState<string | undefined>(undefined);

  const { mutateAsync: changePassword, isLoading } = useMutation(
    auth.changePassword.useMutation()
  );

  const setOldPassword: typeof setOldPassword_ = useCallback((password) => {
    setOldPassword_(password);
    setError(undefined);
  }, []);

  if (user === null) return <></>;
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle sx={{ color: PALETTE.text.secondary }}>
        Change password
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
          onClick={async () => {
            await changePassword({
              oldPassword,
              newPassword,
              email: user.email,
            });
            onSubmit();
          }}
          variant={"contained"}
          loading={isLoading}
        >
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditPasswordDlg;
