import { ConnectError } from "@connectrpc/connect";
import { createConnectQueryKey, useMutation } from "@connectrpc/connect-query";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  FormGroup,
  Link,
  Tab,
  Tabs,
  Zoom,
  ZoomProps,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { isString } from "lodash";
import React, { useCallback, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { THEME, TRoute } from "../../consts";
import * as auth from "../../protos/turbotin-Auth_connectquery";
import { AuthArgs } from "../../protos/turbotin_pb";
import { TDlgProps } from "../../util/promisify";
import EmailEdit, { isValidEmail } from "./emailEdit";
import PasswordEdit, { isValidPassword } from "./passwordEdit";

export const DLG_HEIGHT = "210px";

const TRANSITION_DURATION = {
  enter: THEME.transitions.duration.enteringScreen,
  exit: THEME.transitions.duration.leavingScreen,
};

const AuthDlg = (props: TDlgProps): JSX.Element => {
  const { open, onSubmit, onCancel } = props;
  const [activeTab, setActiveTab_] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { mutateAsync: login, isPending: isLoggingIn } = useMutation(
    auth.login
  );
  const { mutateAsync: signUp, isPending: isSigningUp } = useMutation(
    auth.signUp
  );

  const client = useQueryClient();

  const setActiveTab: typeof setActiveTab_ = useCallback((tab) => {
    setActiveTab_(tab);
    setEmailError(null);
  }, []);

  const getZoomProps = useCallback(
    (tab: typeof activeTab): Partial<ZoomProps> => ({
      in: activeTab === tab,
      unmountOnExit: true,
      timeout: TRANSITION_DURATION,
      style: {
        transitionDelay: `${
          tab === activeTab ? TRANSITION_DURATION.exit : 0
        }ms`,
        display: tab === activeTab ? "inline-block" : "none",
      },
    }),
    [activeTab]
  );

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
        <form>
          <FormGroup>
            <EmailEdit
              email={email}
              setEmail={setEmail}
              error={emailError}
              setError={setEmailError}
            />
            <PasswordEdit
              password={password}
              setPassword={setPassword}
              hideErrors={activeTab === "signup"}
            />

            <Zoom in={activeTab === "login"}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      value={remember}
                      onChange={(e, checked) => setRemember(checked)}
                    />
                  }
                  label="Remember me"
                />
                <Link
                  component={RouterLink}
                  variant={"body2"}
                  onClick={onCancel}
                  to={TRoute.reset_password}
                >
                  Reset password
                </Link>
              </Box>
            </Zoom>
          </FormGroup>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Zoom {...getZoomProps("login")}>
          <span>
            <LoadingButton
              variant={"contained"}
              disabled={!inputIsValid}
              loading={isLoggingIn}
              onClick={async () => {
                if (isString(email) && isValidPassword(password)) {
                  try {
                    await login(new AuthArgs({ email, password, remember }));
                    onSubmit();
                    navigate(location.pathname);
                  } catch (err) {
                    if (err instanceof ConnectError)
                      setEmailError(err.rawMessage);
                  } finally {
                    await client.invalidateQueries({
                      queryKey: createConnectQueryKey(auth.getCurrentUser),
                    });
                  }
                }
              }}
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
              loading={isSigningUp}
              onClick={async () => {
                if (isString(email) && isValidPassword(password)) {
                  try {
                    await signUp(new AuthArgs({ email, password }));
                    onSubmit();
                    navigate(location.pathname);
                  } catch (err) {
                    if (err instanceof ConnectError)
                      setEmailError(err.rawMessage);
                  } finally {
                    await client.invalidateQueries({
                      queryKey: createConnectQueryKey(auth.getCurrentUser),
                    });
                  }
                }
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
