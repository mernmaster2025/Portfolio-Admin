import type { ThemeConfig, ThemePreset } from "@/schemas/portfolio";

export type PresetDefinition = Pick<
  ThemeConfig,
  | "primaryColor"
  | "secondaryColor"
  | "backgroundColor"
  | "surfaceColor"
  | "textColor"
  | "fontFamily"
  | "borderRadius"
> & { mode: ThemeConfig["mode"] };

/**
 * Theme presets. Selecting a preset in the Theme builder applies these values
 * onto the schema; users can then fine-tune any individual token.
 */
export const THEME_PRESETS: Record<ThemePreset, { label: string; def: PresetDefinition }> = {
  minimal: {
    label: "Minimal",
    def: {
      mode: "light",
      primaryColor: "#111111",
      secondaryColor: "#6b7280",
      backgroundColor: "#ffffff",
      surfaceColor: "#f7f7f8",
      textColor: "#111111",
      fontFamily: "Inter",
      borderRadius: 8,
    },
  },
  developer: {
    label: "Developer",
    def: {
      mode: "dark",
      primaryColor: "#2563eb",
      secondaryColor: "#8b5cf6",
      backgroundColor: "#0b0f17",
      surfaceColor: "#121826",
      textColor: "#e6edf3",
      fontFamily: "JetBrains Mono",
      borderRadius: 12,
    },
  },
  corporate: {
    label: "Corporate",
    def: {
      mode: "light",
      primaryColor: "#0a66c2",
      secondaryColor: "#0891b2",
      backgroundColor: "#ffffff",
      surfaceColor: "#f1f5f9",
      textColor: "#0f172a",
      fontFamily: "Roboto",
      borderRadius: 6,
    },
  },
  cyberpunk: {
    label: "Cyberpunk",
    def: {
      mode: "dark",
      primaryColor: "#00f5d4",
      secondaryColor: "#ff006e",
      backgroundColor: "#06010f",
      surfaceColor: "#140a26",
      textColor: "#f6e9ff",
      fontFamily: "Space Grotesk",
      borderRadius: 4,
    },
  },
  glassmorphism: {
    label: "Glassmorphism",
    def: {
      mode: "dark",
      primaryColor: "#7c3aed",
      secondaryColor: "#06b6d4",
      backgroundColor: "#0f1226",
      surfaceColor: "#1b1f3b",
      textColor: "#eef2ff",
      fontFamily: "Poppins",
      borderRadius: 20,
    },
  },
  creative: {
    label: "Creative",
    def: {
      mode: "light",
      primaryColor: "#f97316",
      secondaryColor: "#db2777",
      backgroundColor: "#fffaf5",
      surfaceColor: "#fff1e6",
      textColor: "#1f2937",
      fontFamily: "Montserrat",
      borderRadius: 24,
    },
  },
};
