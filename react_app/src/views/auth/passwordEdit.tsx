import { Visibility } from "@mui/icons-material";
import { IconButton, TextField, TextFieldProps } from "@mui/material";
import { debounce, isString } from "lodash";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

type TProps = {
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  hideErrors?: boolean;
  label?: string;
  autoComplete?: TextFieldProps["autoComplete"];
  customError?: string;
};

const MIN_PASSWORD_LENGTH = 8;
const PASSWORD_HELPER_TEXT = `Password is too short (min ${MIN_PASSWORD_LENGTH})`;

export const isValidPassword = (password: string | null): password is string =>
  isString(password) && password.length >= MIN_PASSWORD_LENGTH;

const PasswordEdit = (props: TProps): JSX.Element => {
  const {
    password,
    setPassword,
    hideErrors = false,
    label = "Password",
    autoComplete = "current-password",
    customError,
  } = props;
  const [passwordType, setPasswordType] =
    useState<TextFieldProps["type"]>("password");

  const [passwordError, setPasswordError] = useState<string | null>();
  const debouncePasswordError = useMemo(
    () => debounce(setPasswordError, 500),
    []
  );

  useEffect(() => debouncePasswordError.cancel(), [debouncePasswordError]);

  return (
    <TextField
      sx={{ mt: 1 }}
      type={passwordType}
      value={password ?? ""}
      onChange={(e) => {
        const password = e.target.value;
        setPassword(password);
        if (isValidPassword(password)) {
          debouncePasswordError.cancel();
          setPasswordError(null);
        } else debouncePasswordError(PASSWORD_HELPER_TEXT);
      }}
      label={label}
      error={isString(customError) || (!hideErrors && isString(passwordError))}
      helperText={customError ?? (!hideErrors && passwordError)}
      autoComplete={autoComplete}
      InputProps={{
        endAdornment: (
          <IconButton
            onMouseDown={() => setPasswordType("text")}
            onMouseUp={() => setPasswordType("password")}
          >
            <Visibility />
          </IconButton>
        ),
      }}
    />
  );
};

export default PasswordEdit;
