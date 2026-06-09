import { createTheme, type Theme } from "@mui/material/styles";

/**
 * The admin dashboard's own design system — independent from the portfolio
 * being built. A clean, modern SaaS look with light and dark variants.
 */
export function buildAdminTheme(mode: "light" | "dark"): Theme {
  const isDark = mode === "dark";
  return createTheme({
    palette: {
      mode,
      primary: { main: "#6366f1" },
      secondary: { main: "#ec4899" },
      success: { main: "#10b981" },
      background: {
        default: isDark ? "#0b0d12" : "#f6f7fb",
        paper: isDark ? "#14171f" : "#ffffff",
      },
      divider: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      h6: { fontWeight: 700 },
      subtitle2: { fontWeight: 600 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: `1px solid ${
              isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)"
            }`,
          },
        },
      },
    },
  });
}
