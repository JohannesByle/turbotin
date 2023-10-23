import React from "react";
import { TDlgProps } from "../promisify";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

type TProps = TDlgProps & {
  title: string;
  body: string;
  submitMsg: string;
  cancelMsg?: string;
};

const ConfirmationDlg = (props: TProps): JSX.Element => {
  const {
    open,
    onCancel,
    onSubmit,
    body,
    cancelMsg = "Cancel",
    submitMsg,
    title,
  } = props;
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{body}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelMsg}</Button>
        <LoadingButton
          onClick={async () => await (onSubmit as () => Promise<void>)()}
          variant={"contained"}
        >
          {submitMsg}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDlg;
