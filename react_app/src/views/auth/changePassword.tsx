import { useMutation } from "@connectrpc/connect-query";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box } from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CENTER_PAGE_SX, TRoute } from "../../consts";
import * as auth from "../../protos/turbotin-Auth_connectquery";
import PasswordEdit, { isValidPassword } from "./passwordEdit";

const ChangePassword = (): JSX.Element => {
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const { code, user_id } = useParams();
  const { mutateAsync: resetPassword, isPending } = useMutation(
    auth.resetPassword
  );

  return (
    <Box sx={CENTER_PAGE_SX}>
      <PasswordEdit
        password={password}
        setPassword={setPassword}
        label={"New Password"}
        autoComplete={"new-password"}
      />
      <LoadingButton
        onClick={async () => {
          await resetPassword({
            code,
            userId: Number(user_id),
            password,
          });
          navigate(TRoute.full_table);
        }}
        sx={{ m: 1 }}
        variant={"contained"}
        disabled={!isValidPassword(password)}
        loading={isPending}
      >
        Change Password
      </LoadingButton>
    </Box>
  );
};

export default ChangePassword;
