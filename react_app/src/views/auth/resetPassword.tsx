import { Box } from "@mui/material";
import React, { useState } from "react";
import { AuthService } from "../../service";
import LoadingButton from "../../util/components/LoadingButton";
import EmailEdit, { isValidEmail } from "./emailEdit";

const ResetPassword = (): JSX.Element => {
  const [email, setEmail] = useState<string>("");

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
      <EmailEdit email={email} setEmail={setEmail} />
      <LoadingButton
        onClick={async () => {
          await AuthService.postAuthResetPassword({ email });
        }}
        sx={{ m: 1 }}
        variant={"contained"}
        disabled={!isValidEmail(email)}
      >
        Reset Password
      </LoadingButton>
    </Box>
  );
};

export default ResetPassword;
