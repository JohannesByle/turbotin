import { Box } from "@mui/material";
import React, { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import EmailEdit, { isValidEmail } from "./emailEdit";
import { useMutation } from "@tanstack/react-query";
import * as auth from "../../protos/turbotin-Auth_connectquery";
import { CENTER_PAGE_SX } from "../../consts";

const ResetPassword = (): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const { mutateAsync: sendPasswordResetCode, isLoading } = useMutation(
    auth.sendPasswordResetCode.useMutation()
  );

  return (
    <Box sx={CENTER_PAGE_SX}>
      <EmailEdit
        email={email}
        setEmail={setEmail}
        error={emailError}
        setError={setEmailError}
      />
      <LoadingButton
        onClick={async () => {
          await sendPasswordResetCode({});
        }}
        sx={{ m: 1 }}
        variant={"contained"}
        disabled={!isValidEmail(email)}
        loading={isLoading}
      >
        Reset Password
      </LoadingButton>
    </Box>
  );
};

export default ResetPassword;