import { isFunction, isUndefined } from "lodash";
import React, { ComponentType, useCallback, useMemo, useState } from "react";

export const DLG_CANCEL_ERROR = "{ec51159b-5e3e-47d8-81be-7f4398179957}";

export const ignoreCancel = (error: unknown): void => {
  if (error !== DLG_CANCEL_ERROR) throw error;
};

type TDlgState<T = void> = {
  resolve?: (value: T) => void;
  reject?: (reason: unknown) => void;
  open: boolean;
};

export type TDlgProps<T = void> = {
  onSubmit: (value: T) => void;
  onCancel: () => void;
  open: boolean;
};

type TNonDlg<Props extends TDlgProps<unknown>> = Omit<Props, keyof TDlgProps>;

type TBaseParams<T, Props extends TDlgProps<T>> = {
  Dlg: ComponentType<Props>;
  unmountOnClose?: boolean;
};

type TParams<T, Props extends TDlgProps<T>> = TDlgProps<T> extends Props
  ? TBaseParams<T, Props>
  : TBaseParams<T, Props> & { defaultProps: TNonDlg<Props> };

export function usePromisify<T, TProps extends TDlgProps<T>>(
  params: TParams<T, TProps>
): [
  JSX.Element | null,
  TDlgProps<T> extends TProps
    ? () => Promise<T>
    : (props?: Partial<TNonDlg<TProps>>) => Promise<T>
] {
  const { Dlg, unmountOnClose = true } = params;
  const defaultProps = "defaultProps" in params ? params.defaultProps : null;
  const [state, setState] = useState<TDlgState<T>>({ open: false });
  const [props, setProps] = useState(defaultProps);
  const { open, reject, resolve } = state;

  const onSubmit = useCallback(
    (value: T) => {
      setState((prev) => ({ ...prev, open: false }));
      if (isFunction(resolve)) resolve(value);
    },
    [resolve]
  );

  const onCancel = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
    if (isFunction(reject)) reject(DLG_CANCEL_ERROR);
  }, [reject]);

  const dlg = useMemo(
    () =>
      open || !unmountOnClose ? (
        <Dlg
          {...(props as TProps)}
          open={open}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      ) : null,
    [Dlg, onCancel, onSubmit, open, props, unmountOnClose]
  );

  const showDlg = useCallback(
    async (props?: Partial<TNonDlg<TProps>>) =>
      await new Promise<T>((resolve, reject) => {
        if (!isUndefined(props))
          setProps((prev) => ({ ...prev, ...(props as TProps) }));
        setState({ open: true, resolve, reject });
      }),
    []
  );

  return [dlg, showDlg];
}
