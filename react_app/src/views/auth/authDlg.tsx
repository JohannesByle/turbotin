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
  useTheme,
} from "@mui/material";
import { isString } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { TRoute } from "../../consts";
import { AuthService } from "../../service";
import { executeAction } from "../../util/actions";
import { TDlgProps } from "../../util/promisify";
import EmailEdit, { isValidEmail } from "./emailEdit";
import PasswordEdit, { isValidPassword } from "./passwordEdit";

export const DLG_HEIGHT = "210px";

const AuthDlg = (props: TDlgProps): JSX.Element => {
  const { open, onSubmit, onCancel } = props;
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

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
          <EmailEdit email={email} setEmail={setEmail} />
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
                disabled={loading}
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
                      }).then(() => onSubmit()),
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
                      }).then(() => onSubmit()),
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
