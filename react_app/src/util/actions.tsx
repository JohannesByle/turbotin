import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import React from "react";
import { TSetState } from ".";
import { isNull, isUndefined } from "lodash";

export type TAction = {
  title: string;
  icon?: JSX.Element;
  f: () => unknown;
};

type TProps = {
  actions: TAction[];
  anchorEl: HTMLElement | null;
  setAnchorEl: TSetState<HTMLElement | null>;
};

export const ActionMenu = (props: TProps): JSX.Element => {
  const { anchorEl, setAnchorEl, actions } = props;

  return (
    <Menu
      open={!isNull(anchorEl)}
      onClose={() => setAnchorEl(null)}
      anchorEl={anchorEl}
    >
      {actions.map(({ title, icon, f }) => (
        <MenuItem
          key={title}
          onClick={() => {
            f();
            setAnchorEl(null);
          }}
        >
          {isUndefined(icon) || <ListItemIcon>{icon}</ListItemIcon>}
          <ListItemText>{title}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
};
