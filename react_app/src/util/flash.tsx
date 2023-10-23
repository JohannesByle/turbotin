import { ConnectError, Transport } from "@connectrpc/connect";
import { TransportProvider } from "@connectrpc/connect-query";
import { createConnectTransport } from "@connectrpc/connect-web";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import { isNull } from "lodash";
import React, {
  PropsWithChildren,
  createContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { TSetState } from ".";
import { APP_BAR_ID, MS_PER_SECOND, voidFn } from "../consts";
import { Severity } from "../protos/turbotin_pb";
import { proto3 } from "@bufbuild/protobuf";
import { Auth } from "../protos/turbotin-Auth_connectquery";

const { ERROR, INFO, SUCCESS, WARNING, UNSPECIFIED } = Severity;

const SEVERITIES: Record<Severity, AlertColor> = {
  [UNSPECIFIED]: "info",
  [ERROR]: "error",
  [INFO]: "info",
  [SUCCESS]: "success",
  [WARNING]: "warning",
};

const FLASH_KEY = "B9273F67-1395-4751-8AF7-28F3227A56B3";
const SEVERITY_KEY = "F96945C6-0F7A-4148-9032-56C658233522";

const FlashesContext =
  createContext<TSetState<Map<string, [string, Severity]>>>(voidFn);

function getTransport(
  setFlashes: TSetState<Map<string, [string, Severity]>>
): Transport {
  return createConnectTransport({
    baseUrl: window.location.origin,
    interceptors: [
      (next) => async (req) => {
        const doSetFlashes = (flash: string, severity: Severity): void => {
          const key = crypto.randomUUID();
          setFlashes((prev) => new Map(prev).set(key, [flash, severity]));
          setTimeout(
            () =>
              setFlashes((prev) => {
                const result = new Map(prev);
                result.delete(key);
                return result;
              }),
            6 * MS_PER_SECOND
          );
        };
        try {
          const resp = await next(req);
          const flash = resp.header.get(FLASH_KEY);
          const severity =
            proto3
              .getEnumType(Severity)
              .findName(resp.header.get(SEVERITY_KEY) ?? "")?.no ?? null;
          if (!isNull(flash) && !isNull(severity))
            doSetFlashes(flash, severity);

          return resp;
        } catch (e) {
          if (e instanceof ConnectError) {
            if (req.method.name !== Auth.methods.getCurrentUser.name)
              doSetFlashes(e.rawMessage, ERROR);
          }
          throw e;
        }
      },
    ],
  });
}

export const FlashesProvider = (props: PropsWithChildren): JSX.Element => {
  const { children } = props;

  const [flashes, setFlashes] = useState<Map<string, [string, Severity]>>(
    new Map()
  );

  const transport = useMemo(() => getTransport(setFlashes), []);

  const appBarHeight = document.getElementById(APP_BAR_ID)?.offsetHeight ?? 0;

  const { current: onClose } = useRef((key: string) =>
    setFlashes((prev) => {
      const result = new Map(prev);
      result.delete(key);
      return result;
    })
  );

  return (
    <FlashesContext.Provider value={setFlashes}>
      <TransportProvider transport={transport}>
        {[...flashes.entries()].map(([key, [msg, severity]]) => (
          <Snackbar
            key={key}
            open={true}
            onClose={() => onClose(key)}
            sx={{ mt: `${appBarHeight}px` }}
            anchorOrigin={{ horizontal: "center", vertical: "top" }}
          >
            <Alert
              severity={SEVERITIES[severity]}
              onClose={() => onClose(key)}
              elevation={1}
            >
              {msg}
            </Alert>
          </Snackbar>
        ))}
        {children}
      </TransportProvider>
    </FlashesContext.Provider>
  );
};
