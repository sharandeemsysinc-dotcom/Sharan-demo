import React from "react";
import { Tabs as MuiTabs, Tab, Box } from "@mui/material";
import tab from "./Tabs.module.scss";

type TabItem = { label: string; content: React.ReactNode, labelColor?: string; activeColor?: string; };

type Props = { tabs: TabItem[], centered?: boolean; activeColor?: string; labelColor?: string; };

const Tabs: React.FC<Props> = ({ tabs, centered, activeColor, labelColor }) => {
  const [value, setValue] = React.useState(0);
  return (
    <Box>
      <MuiTabs
        value={value}
        onChange={(_, v) => setValue(v)}
        centered={centered}
        className={tab.customTabs}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        style={{
          // @ts-ignore
          "--indicator-color": tabs[value]?.activeColor || activeColor || "#0e9f87",
        }}
      >
        {tabs.map((t, i) => (
          <Tab
            key={i}
            label={t.label}
            className={tab.customTab}
            style={{
              // @ts-ignore
              "--tab-color": t.labelColor || labelColor || "#000",
              "--tab-active-color": t.activeColor || activeColor || "#0e9f87",
            }}
          />
        ))}
      </MuiTabs>
      <Box className={`${tab["tabPanel"]} mt-3`}>
        {tabs[value] && tabs[value].content}
      </Box>
    </Box>
  );
};

export default Tabs;
