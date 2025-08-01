"use client";

import { createTheme } from "@mui/material/styles";
import { getComponentOverrides } from "./overrides";
import { palette } from "./palette";

const theme = createTheme({
  palette,
  typography: {
    fontFamily: "var(--font-exo2), sans-serif",
  },
  shape: {
    borderRadius: 14,
  },
  spacing: 8,
});

theme.components = getComponentOverrides(theme);

export default theme;
