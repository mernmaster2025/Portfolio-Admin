"use client";

import { useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { buildAdminTheme } from "@/theme/adminTheme";
import { useUiStore } from "@/stores/uiStore";

/** Wraps the admin dashboard in its own MUI theme (separate from the preview). */
export default function AdminProviders({ children }: { children: React.ReactNode }) {
  const adminMode = useUiStore((s) => s.adminMode);
  const theme = useMemo(() => buildAdminTheme(adminMode), [adminMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
