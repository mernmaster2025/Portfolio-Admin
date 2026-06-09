import type { HeaderConfig } from "@/schemas/portfolio";

/**
 * Appearance-only fields a quick-style preset can set.
 *
 * Note: this deliberately excludes structural settings that live in the Style
 * card — `variant`, `position`, `floating`, and `animation` — so picking a
 * quick style only changes the visual skin and never your chosen layout.
 */
export type HeaderAppearanceFields = Pick<
  HeaderConfig,
  | "background"
  | "backgroundColor"
  | "gradientFrom"
  | "gradientTo"
  | "gradientAngle"
  | "navStyle"
  | "height"
  | "showBorder"
>;

export interface HeaderAppearancePreset {
  id: string;
  label: string;
  fields: HeaderAppearanceFields;
}

/**
 * Curated, good-looking header looks shown first in the Appearance section.
 * Selecting one applies the whole set; the manual controls below fine-tune it.
 */
export const HEADER_APPEARANCE_PRESETS: HeaderAppearancePreset[] = [
  {
    id: "glass",
    label: "Glass",
    fields: {
      background: "blur",
      backgroundColor: "#101622",
      gradientFrom: "#2563eb",
      gradientTo: "#8b5cf6",
      gradientAngle: 135,
      navStyle: "text",
      height: 64,
      showBorder: false,
    },
  },
  {
    id: "glass-pill",
    label: "Glass Pill",
    fields: {
      background: "blur",
      backgroundColor: "#101622",
      gradientFrom: "#2563eb",
      gradientTo: "#8b5cf6",
      gradientAngle: 135,
      navStyle: "pill",
      height: 64,
      showBorder: false,
    },
  },
  {
    id: "gradient-flow",
    label: "Gradient Flow",
    fields: {
      background: "gradient",
      backgroundColor: "#101622",
      gradientFrom: "#6366f1",
      gradientTo: "#ec4899",
      gradientAngle: 120,
      navStyle: "underline",
      height: 72,
      showBorder: false,
    },
  },
  {
    id: "solid-pill",
    label: "Solid",
    fields: {
      background: "solid",
      backgroundColor: "#0f172a",
      gradientFrom: "#2563eb",
      gradientTo: "#8b5cf6",
      gradientAngle: 135,
      navStyle: "pill",
      height: 68,
      showBorder: false,
    },
  },
  {
    id: "minimal-line",
    label: "Minimal Line",
    fields: {
      background: "transparent",
      backgroundColor: "#101622",
      gradientFrom: "#2563eb",
      gradientTo: "#8b5cf6",
      gradientAngle: 135,
      navStyle: "underline",
      height: 60,
      showBorder: true,
    },
  },
  {
    id: "bold",
    label: "Bold",
    fields: {
      background: "solid",
      backgroundColor: "#111827",
      gradientFrom: "#2563eb",
      gradientTo: "#8b5cf6",
      gradientAngle: 135,
      navStyle: "underline",
      height: 84,
      showBorder: false,
    },
  },
];

/** A header matches a preset when every appearance field equals the preset's. */
export function matchesHeaderPreset(header: HeaderConfig, preset: HeaderAppearancePreset): boolean {
  return (Object.keys(preset.fields) as (keyof HeaderAppearanceFields)[]).every(
    (k) => header[k] === preset.fields[k]
  );
}

/** Swatch background used to preview a preset. */
export function presetSwatchSx(f: HeaderAppearanceFields): Record<string, unknown> {
  if (f.background === "gradient")
    return { background: `linear-gradient(${f.gradientAngle}deg, ${f.gradientFrom}, ${f.gradientTo})` };
  if (f.background === "solid") return { bgcolor: f.backgroundColor };
  if (f.background === "transparent")
    return { bgcolor: "transparent", border: "1px dashed", borderColor: "divider" };
  return { background: "linear-gradient(135deg, #334155, #0f172a)" }; // blur/glass hint
}
