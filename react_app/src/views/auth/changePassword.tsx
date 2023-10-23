import LoadingButton from "@mui/lab/LoadingButton";
import { Box } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TRoute } from "../../consts";
import * as auth from "../../protos/turbotin-Auth_connectquery";
import PasswordEdit, { isValidPassword } from "./passwordEdit";

const ChangePassword = (): JSX.Element => {
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const { code, user_id } = useParams();
  const { mutateAsync: resetPassword, isLoading } = useMutation(
    auth.resetPassword.useMutation()
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        mt: "25vh",
      }}
    >
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
        loading={isLoading}
      >
        Change Password
      </LoadingButton>
    </Box>
  );
};

export default ChangePassword;
