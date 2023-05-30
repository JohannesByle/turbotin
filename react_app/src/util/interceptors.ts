import axios, { AxiosError } from "axios";
import { useEffect } from "react";
import { TSetState } from ".";
import { UserDetails } from "../service";
import { CLIENT_REQUEST_STR, CURRENT_USER_STR, FLASHES_STR } from "../consts";
import { isEqual, isString } from "lodash";
import { StatusCodes } from "http-status-codes";

export const useInterceptors = (
  setUser: TSetState<UserDetails | null>,
  setFlashesStr: (flashesStr: string) => void
): void => {
  useEffect(() => {
    axios.interceptors.request.use((req) => {
      req.headers.set(CLIENT_REQUEST_STR, true);
      return req;
    });
    axios.interceptors.response.use(
      (res) => {
        const userStr: unknown = res.headers[CURRENT_USER_STR];
        setUser((prev) => {
          if (!isString(userStr)) return null;
          const result = JSON.parse(userStr) as UserDetails;
          return isEqual(result, prev) ? prev : result;
        });
        const flashesStr: unknown = res.headers[FLASHES_STR];
        if (isString(flashesStr)) setFlashesStr(flashesStr);
        return res;
      },
      (e: AxiosError) => {
        const flashesStr: unknown = e.response?.headers[FLASHES_STR];
        if (isString(flashesStr)) setFlashesStr(flashesStr);
        if (e.response?.status === StatusCodes.UNAUTHORIZED) setUser(null);

        throw e;
      }
    );
  }, [setFlashesStr, setUser]);
};
