import { Category, Link, Tag } from "@mui/icons-material";
import { Box, Divider, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { PALETTE } from "../../consts";
import { arrayOf } from "../../util";
import Categories from "./categories";
import { TTab } from "./consts";
import Tags from "./tags";
import TobaccoLinks from "./tobaccoLinks";

const { tags, categories, tobaccoLinks } = TTab;

const VIEWS: Record<TTab, JSX.Element> = {
  [tags]: <Tags />,
  [categories]: <Categories />,
  [tobaccoLinks]: <TobaccoLinks />,
};

const ICONS: Record<TTab, JSX.Element> = {
  [tags]: <Tag />,
  [categories]: <Category />,
  [tobaccoLinks]: <Link />,
};

const Admin = (): JSX.Element => {
  const [tab, setTab] = useState<TTab>(tags);

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
        sx={{ background: PALETTE.background.paper }}
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
