"use client";

import React, { FC, ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material";

interface Props {
  children: ReactNode;
  fonts: string;
}

const MuiThemeProvider: FC<Props> = ({ children, fonts }) => {
  const theme = createTheme({
    typography: {
      fontFamily: fonts,
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default MuiThemeProvider;
