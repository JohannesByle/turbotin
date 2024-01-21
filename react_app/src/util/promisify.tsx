import { isFunction, isUndefined } from "lodash";
import React, { ComponentType, useMemo, useRef, useState } from "react";

const DLG_CANCEL_ERROR = Symbol("Dlg cancel");

window.addEventListener("unhandledrejection", function (e) {
  if (e.reason === DLG_CANCEL_ERROR) e.preventDefault();
});

type TDlgState<T = void, Props extends TDlgProps<T> = TDlgProps<T>> = {
  resolve?: (value: T) => void;
  reject?: (reason: unknown) => void;
  props?: Partial<TNonDlg<Props>>;
};

export type TDlgProps<T = void> = {
  onSubmit: (value: T) => void;
  onCancel: () => void;
  open: boolean;
};

type TNonDlg<Props extends TDlgProps<unknown>> = Omit<Props, keyof TDlgProps>;

export function usePromisify<T, Props extends TDlgProps<T>>(
  Dlg: ComponentType<Props>
): [JSX.Element | null, (props: Partial<TNonDlg<Props>>) => Promise<T>] {
  const [state, setState] = useState<TDlgState<T>>({});

  const dlg = useMemo(() => {
    const { props, reject, resolve } = state;
    if (isUndefined(props) || isUndefined(reject) || isUndefined(resolve))
      return <></>;
    return (
      <Dlg
        {...(props as Props)}
        open={true}
        onSubmit={(value: T) => {
          setState({});
          if (isFunction(resolve)) resolve(value);
        }}
        onCancel={() => {
          setState({});
          if (isFunction(reject)) reject(DLG_CANCEL_ERROR);
        }}
      />
    );
  }, [Dlg, state]);

  const { current: showDlg } = useRef(
    async (props: Partial<TNonDlg<Props>>) =>
      await new Promise<T>((resolve, reject) => {
        setState({ resolve, reject, props });
      })
  );

  return [dlg, showDlg];
}
