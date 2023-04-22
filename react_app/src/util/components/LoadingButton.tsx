import {
  LoadingButton as MUILoadingButton,
  LoadingButtonProps,
} from "@mui/lab";
import React, { forwardRef, useState } from "react";
import { ActionFn, executeAction } from "../actions";

type Props = {
  onClick: ActionFn;
} & Omit<LoadingButtonProps, `on${string}` | "loading">;

const LoadingButton = forwardRef<HTMLButtonElement, Props>(
  (props, ref): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(false);
    const { onClick, ...buttonProps } = props;
    return (
      <MUILoadingButton
        {...buttonProps}
        loading={loading}
        onClick={() => void executeAction(onClick, setLoading)}
        ref={ref}
      />
    );
  }
);
LoadingButton.displayName = "LoadingButton";

export default LoadingButton;
