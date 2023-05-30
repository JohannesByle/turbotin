import { Box, TextField } from "@mui/material";
import React, { useState } from "react";
import { AuthService } from "../../service";
import LoadingButton from "../../util/components/LoadingButton";
import PasswordEdit, { isValidPassword } from "./passwordEdit";
import { usePromisify } from "../../util/promisify";
import AuthDlg from "./authDlg";
import { redirect } from "react-router-dom";
import { TRoute } from "../../consts";

const ChangePassword = (): JSX.Element => {
  const [password, setPassword] = useState<string>("");
  const [authDlg, showAuthDlg] = usePromisify({ Dlg: AuthDlg });
  const [hideSelf, setHideSelf] = useState<boolean>(false);

  const params = new URLSearchParams(window.location.search);
  const user_id = Number(params.get("user_id"));
  const password_reset_code = String(params.get("password_reset_code"));
  const email = String(params.get("email"));

  return (
    <>
      {authDlg}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          mt: "25vh",
          visibility: hideSelf ? "hidden" : undefined,
        }}
      >
        <TextField
          value={email}
          sx={{ display: "none" }}
          autoComplete={"username"}
        />
        <PasswordEdit
          password={password}
          setPassword={setPassword}
          label={"New Password"}
          autoComplete={"new-password"}
        />
        <LoadingButton
          onClick={async () => {
            await AuthService.postAuthResetPasswordChange({
              user_id,
              password_reset_code,
              new_password: password,
            });
            setHideSelf(true);
            void showAuthDlg().then(() => redirect(TRoute.my_account));
          }}
          sx={{ m: 1 }}
          variant={"contained"}
          disabled={!isValidPassword(password)}
        >
          Change Password
        </LoadingButton>
      </Box>
    </>
  );
};

export default ChangePassword;
