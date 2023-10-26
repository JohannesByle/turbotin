import { Tag } from "@mui/icons-material";
import { Box, Divider, Tab, Tabs, useTheme } from "@mui/material";
import React, { useState } from "react";
import { arrayOf } from "../../util";
import { TTab } from "./consts";
import Tags from "./tags";

const { tags } = TTab;

const VIEWS: Record<TTab, JSX.Element> = {
  [tags]: <Tags />,
};

const ICONS: Record<TTab, JSX.Element> = {
  [tags]: <Tag />,
};

const Admin = (): JSX.Element => {
  const [tab, setTab] = useState<TTab>(tags);

  const { palette } = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v as TTab)}
        orientation="vertical"
        sx={{ background: palette.background.paper, width: 200 }}
      >
        {arrayOf(TTab).map((t) => (
          <Tab key={t} value={t} label={t} icon={ICONS[t]} />
        ))}
      </Tabs>
      <Divider flexItem orientation="vertical" />
      {VIEWS[tab]}
    </Box>
  );
};

export default Admin;
