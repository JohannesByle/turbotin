import { isFunction } from "lodash";
import { SetState } from ".";
import { ignoreCancel } from "./promisify";

export type Waitable = Promise<unknown> | unknown;

export type ActionFn = (setLoading: SetState<boolean>) => Waitable;

export type Action = {
  f: ActionFn;
  title: string;
  icon?: JSX.Element;
};

type Config = {
  override?: Array<"start" | "end">;
  suppressDlgCancel?: boolean;
};

export async function executeAction(
  action: Action | ActionFn,
  setLoading: SetState<boolean>,
  config?: Config
): Promise<void> {
  const fn = isFunction(action) ? action : action.f;
  const { suppressDlgCancel = true, override: override_ = [] } = config ?? {};
  const override = new Set(override_);
  try {
    if (!override.has("start")) setLoading(true);
    await fn(setLoading);
  } catch (error) {
    if (suppressDlgCancel) ignoreCancel(error);
    else throw error;
  } finally {
    if (!override.has("end")) setLoading(false);
  }
}
