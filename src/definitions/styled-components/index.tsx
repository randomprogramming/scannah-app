export * from "./common";

import React from "react";
import { ThemeProvider } from "styled-components";
import { common } from "./common";

export const StyledThemeProvider: React.FC = ({ children }) => {
  return <ThemeProvider theme={common}>{children}</ThemeProvider>;
};
