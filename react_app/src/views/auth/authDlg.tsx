import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  FormGroup,
  Tab,
  Tabs,
  TextField,
  useTheme,
  Zoom,
  ZoomProps,
} from "@mui/material";
import { StatusCodes } from "http-status-codes";
import { debounce, isArray, isString } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError, AuthService } from "../../service";
import { executeAction } from "../../util/actions";
import { TDlgProps } from "../../util/promisify";
import PasswordEdit from "./passwordEdit";

export const DLG_HEIGHT = "210px";

const EMAIL_REGEX = "^[A-z0-9+_.-]+@[A-z0-9.-]+$";
const EMAIL_HELPER_TEXT = "Please provide a valid email";
const EMAIL_EXISTS_ERROR = "That email already exists";
const INCORRECT_ERROR = "Incorrect email/password";

const isValidEmail = (email: string | null): email is string =>
  isString(email) && isArray(email.trim().match(EMAIL_REGEX));

const MIN_PASSWORD_LENGTH = 6;
export const PASSWORD_HELPER_TEXT = `Password is too short (min ${MIN_PASSWORD_LENGTH})`;

export const isValidPassword = (password: string | null): password is string =>
  isString(password) && password.length >= MIN_PASSWORD_LENGTH;

const AuthDlg = (props: TDlgProps): JSX.Element => {
  const { open, onSubmit, onCancel } = props;
  const [activeTab, setActiveTab_] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [emailError, setEmailError] = useState<string | null>();

  const debounceEmailError = useMemo(() => debounce(setEmailError, 500), []);

  const setActiveTab = useCallback(
    (tab: typeof activeTab) => {
      if (
        (tab === "login" && emailError === EMAIL_EXISTS_ERROR) ||
        (tab === "signup" && emailError === INCORRECT_ERROR)
      )
        setEmailError(null);

      setActiveTab_(tab);
    },
    [emailError]
  );

  const theme = useTheme();

  const transitionDuration = useMemo(
    () => ({
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen,
    }),
    [theme]
  );

  const getZoomProps = useCallback(
    (tab: typeof activeTab): Partial<ZoomProps> => ({
      in: activeTab === tab,
      unmountOnExit: true,
      timeout: transitionDuration,
      style: {
        transitionDelay: `${tab === activeTab ? transitionDuration.exit : 0}ms`,
        display: tab === activeTab ? "inline-block" : "none",
      },
    }),
    [transitionDuration, activeTab]
  );

  useEffect(() => () => debounceEmailError.cancel(), [debounceEmailError]);

  const inputIsValid = isValidEmail(email) && isValidPassword(password);

  return (
    <Dialog open={open} onClose={onCancel}>
      <Tabs
        value={activeTab}
        onChange={(e, value) => setActiveTab(value as typeof activeTab)}
      >
        <Tab
          value={"login"}
          label={"Login"}
          icon={<LoginIcon />}
          iconPosition={"start"}
        />
        <Tab
          value={"signup"}
          label={"Sign Up"}
          icon={<PersonAddIcon />}
          iconPosition={"start"}
        />
      </Tabs>
      <Divider />
      <DialogContent>
        <FormGroup>
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
            error={isString(emailError)}
            helperText={emailError}
            disabled={loading}
          />
          <PasswordEdit
            password={password}
            setPassword={setPassword}
            hideErrors={activeTab === "signup"}
            loading={loading}
          />
          <Zoom in={activeTab === "login"}>
            <FormControlLabel
              control={
                <Checkbox
                  value={remember}
                  onChange={(e, checked) => setRemember(checked)}
                />
              }
              disabled={loading}
              label="Remember me"
            />
          </Zoom>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Zoom {...getZoomProps("login")}>
          <span>
            <LoadingButton
              variant={"contained"}
              disabled={!inputIsValid}
              onClick={() => {
                if (isString(email) && isValidPassword(password))
                  void executeAction(
                    async () =>
                      await AuthService.postAuthLogin({
                        email,
                        password,
                        remember,
                      })
                        .then(() => onSubmit())
                        .catch((e: ApiError) => {
                          if (e.status === StatusCodes.UNAUTHORIZED)
                            setEmailError(INCORRECT_ERROR);
                        }),
                    setLoading
                  );
              }}
              loading={loading}
            >
              Login
            </LoadingButton>
          </span>
        </Zoom>
        <Zoom {...getZoomProps("signup")}>
          <span>
            <LoadingButton
              variant={"contained"}
              disabled={!inputIsValid}
              loading={loading}
              onClick={() => {
                if (isString(email) && isValidPassword(password))
                  void executeAction(
                    async () =>
                      await AuthService.postAuthSignup({
                        email,
                        password,
                      })
                        .then(() => onSubmit())
                        .catch((e: ApiError) => {
                          if (e.status === StatusCodes.CONFLICT)
                            setEmailError(EMAIL_EXISTS_ERROR);
                        }),
                    setLoading
                  );
              }}
            >
              Sign Up
            </LoadingButton>
          </span>
        </Zoom>
      </DialogActions>
    </Dialog>
  );
};

export default AuthDlg;
