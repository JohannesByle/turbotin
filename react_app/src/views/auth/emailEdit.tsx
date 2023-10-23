import { TextField } from "@mui/material";
import { debounce, isArray, isString } from "lodash";
import React, { Dispatch, SetStateAction, useEffect, useMemo } from "react";

const EMAIL_REGEX = "^[A-z0-9+_.-]+@[A-z0-9.-]+$";
const EMAIL_HELPER_TEXT = "Please provide a valid email";

export const isValidEmail = (email: string | null): email is string =>
  isString(email) && isArray(email.trim().match(EMAIL_REGEX));

type TProps = {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  hideErrors?: boolean;
};

const EmailEdit = (props: TProps): JSX.Element => {
  const { email, setEmail, error, setError, hideErrors = false } = props;

  const debounceEmailError = useMemo(() => debounce(setError, 500), [setError]);

  useEffect(() => debounceEmailError.cancel(), [debounceEmailError]);

  return (
    <TextField
      type={"email"}
      value={email ?? ""}
      onChange={(e) => {
        const email = e.target.value;
        setEmail(email);
        if (isValidEmail(email)) {
          debounceEmailError.cancel();
          setError(null);
        } else debounceEmailError(EMAIL_HELPER_TEXT);
      }}
      label={"Email"}
      error={!hideErrors && isString(error)}
      helperText={!hideErrors && error}
      autoComplete="email"
      name="email"
    />
  );
};

export default EmailEdit;
