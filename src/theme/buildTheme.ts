import { createTheme, type Theme } from "@mui/material/styles";
import type { ThemeConfig, ThemeMode } from "@/schemas/portfolio";

/** CSS font stacks for each supported font family. */
export const FONT_STACKS: Record<ThemeConfig["fontFamily"], string> = {
  Inter: '"Inter", system-ui, -apple-system, sans-serif',
  Roboto: '"Roboto", system-ui, sans-serif',
  Poppins: '"Poppins", system-ui, sans-serif',
  Montserrat: '"Montserrat", system-ui, sans-serif',
  "Space Grotesk": '"Space Grotesk", system-ui, sans-serif',
  "JetBrains Mono": '"JetBrains Mono", ui-monospace, monospace',
};

/** Google Fonts families to request for a given selection. */
export const GOOGLE_FONT_FAMILIES = [
  "Inter:wght@400;500;600;700;800",
  "Roboto:wght@400;500;700",
  "Poppins:wght@400;500;600;700",
  "Montserrat:wght@400;500;600;700",
  "Space+Grotesk:wght@400;500;600;700",
  "JetBrains+Mono:wght@400;500;700",
];

export const googleFontsHref = `https://fonts.googleapis.com/css2?${GOOGLE_FONT_FAMILIES.map(
  (f) => `family=${f}`
).join("&")}&display=swap`;

/** Resolve "system" to a concrete mode using a prefers-color-scheme hint. */
export function resolveMode(mode: ThemeMode, prefersDark = true): "light" | "dark" {
  if (mode === "system") return prefersDark ? "dark" : "light";
  return mode;
}

/** Relative luminance (0–1) of a hex color, for light/dark detection. */
function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * The authored background/surface/text colors describe one mode. When the
 * visitor flips to the opposite mode we derive a sensible, readable palette
 * rather than reusing dark colors on a light background.
 */
function modeColors(theme: ThemeConfig, mode: "light" | "dark") {
  const storedIsDark = luminance(theme.backgroundColor) < 0.5;
  if ((mode === "dark") === storedIsDark) {
    return {
      background: theme.backgroundColor,
      surface: theme.surfaceColor,
      text: theme.textColor,
    };
  }
  return mode === "dark"
    ? { background: "#0b0f17", surface: "#121826", text: "#e6edf3" }
    : { background: "#ffffff", surface: "#f4f6fb", text: "#0f172a" };
}

/** Build the MUI theme used to render the portfolio preview / export. */
export function buildPortfolioTheme(theme: ThemeConfig, mode: "light" | "dark"): Theme {
  const colors = modeColors(theme, mode);
  const fontFamily = FONT_STACKS[theme.fontFamily];

  return createTheme({
    palette: {
      mode,
      primary: { main: theme.primaryColor },
      secondary: { main: theme.secondaryColor },
      background: { default: colors.background, paper: colors.surface },
      text: { primary: colors.text },
    },
    shape: { borderRadius: theme.borderRadius },
    typography: {
      fontFamily,
      h1: { fontWeight: 800, letterSpacing: "-0.02em" },
      h2: { fontWeight: 700, letterSpacing: "-0.01em" },
      h3: { fontWeight: 700 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { borderRadius: theme.borderRadius } },
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: theme.borderRadius, backgroundImage: "none" },
        },
      },
    },
  });
}
