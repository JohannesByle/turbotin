import { TextField } from "@mui/material";
import { debounce, isArray, isString } from "lodash";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

const EMAIL_REGEX = "^[A-z0-9+_.-]+@[A-z0-9.-]+$";
const EMAIL_HELPER_TEXT = "Please provide a valid email";

export const isValidEmail = (email: string | null): email is string =>
  isString(email) && isArray(email.trim().match(EMAIL_REGEX));

type TProps = {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  hideErrors?: boolean;
  customError?: string;
};

const EmailEdit = (props: TProps): JSX.Element => {
  const { email, setEmail, hideErrors = false, customError } = props;
  const [emailError, setEmailError] = useState<string | null>();

  const debounceEmailError = useMemo(() => debounce(setEmailError, 500), []);

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
          setEmailError(null);
        } else debounceEmailError(EMAIL_HELPER_TEXT);
      }}
      label={"Email"}
      error={isString(customError) || (!hideErrors && isString(emailError))}
      helperText={customError ?? (!hideErrors && emailError)}
    />
  );
};

export default EmailEdit;
