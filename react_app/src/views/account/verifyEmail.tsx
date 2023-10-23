import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TRoute } from "../../consts";
import * as auth from "../../protos/turbotin-Auth_connectquery";
import { Box, CircularProgress } from "@mui/material";

const VerifyEmail = (): JSX.Element => {
  const { code, user_id } = useParams();
  const { mutateAsync: verifyEmail } = useMutation(
    auth.verifyEmail.useMutation()
  );
  const navigate = useNavigate();
  const client = useQueryClient();

  useEffect(() => {
    void verifyEmail({ code, userId: Number(user_id) }).then(async () => {
      await client.invalidateQueries({
        queryKey: auth.getCurrentUser.getQueryKey(),
      });
      navigate(TRoute.my_account);
    });
  }, [code, user_id, verifyEmail, navigate, client]);

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
      <CircularProgress />
    </Box>
  );
};

export default VerifyEmail;
