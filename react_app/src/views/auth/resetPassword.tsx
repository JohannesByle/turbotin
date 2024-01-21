import { useMutation } from "@connectrpc/connect-query";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box } from "@mui/material";
import React, { useState } from "react";
import { CENTER_PAGE_SX } from "../../consts";
import * as auth from "../../protos/turbotin-Auth_connectquery";
import EmailEdit, { isValidEmail } from "./emailEdit";

const ResetPassword = (): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const { mutateAsync: sendPasswordResetCode, isPending } = useMutation(
    auth.sendPasswordResetCode
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
          await sendPasswordResetCode({ email });
        }}
        sx={{ m: 1 }}
        variant={"contained"}
        disabled={!isValidEmail(email)}
        loading={isPending}
      >
        Reset Password
      </LoadingButton>
    </Box>
  );
};

export default ResetPassword;
