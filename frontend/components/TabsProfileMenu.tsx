"use client";

import React, { useState, FC } from "react";
import { styled } from "@mui/material/styles";
import Tabs, { TabsProps } from "@mui/material/Tabs";
import Tab, { TabProps } from "@mui/material/Tab";
import { usePathname, useRouter } from "@/navigation";

interface Props {
  tabs: { label: string; path: string }[];
}

const TabsProfileMenu: FC<Props> = ({ tabs }) => {
  const router = useRouter();
  const pathname = usePathname();

  const currentTabIndex = tabs.findIndex((tab) => pathname === tab.path);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    router.push(tabs[newValue].path);
  };

  return (
    <StyledTabs
      value={currentTabIndex}
      onChange={handleChange}
      variant="scrollable"
      scrollButtons="auto"
    >
      {tabs.map((tab, index) => (
        <StyledTab key={index} label={tab.label} />
      ))}
    </StyledTabs>
  );
};

export default TabsProfileMenu;

const StyledTabs = styled((props: TabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  marginTop: "2rem",
  width: "100%",
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    backgroundColor: "#Cecaff",
  },
  "& .MuiTabs-flexContainer": {
    display: "flex",
    justifyContent: "center",
  },
});

const StyledTab = styled((props: TabProps) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    marginRight: "0.4rem",
    minWidth: "42px",
    fontSize: "18px",
    color: "#1C131E",
    fontWeight: 300,
    "&.Mui-selected": {
      color: "#Cecaff",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#Cecaff",
    },
  })
);
