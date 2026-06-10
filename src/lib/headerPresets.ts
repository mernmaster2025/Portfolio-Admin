import type { HeaderConfig } from "@/schemas/portfolio";

/** Appearance-only fields a quick-style preset can set (no structural settings). */
export type HeaderAppearanceFields = Pick<
  HeaderConfig,
  | "background"
  | "backgroundColor"
  | "gradientFrom"
  | "gradientTo"
  | "gradientAngle"
  | "navStyle"
  | "height"
>;

export interface HeaderAppearancePreset {
  id: string;
  label: string;
  fields: HeaderAppearanceFields;
}

// Gradient fields are kept at the schema defaults across presets (unused by any
// look now) so they never affect preset matching.
const GRAD = { gradientFrom: "#2563eb", gradientTo: "#8b5cf6", gradientAngle: 135 } as const;

/**
 * Curated, good-looking header looks — inspired by modern product sites
 * (glassy SaaS bars) and classic Material AppBars. Solid bars auto-pick
 * readable text, so the light "Paper" look works in any theme.
 */
export const HEADER_APPEARANCE_PRESETS: HeaderAppearancePreset[] = [
  {
    id: "aurora",
    label: "Aurora",
    fields: { background: "blur", backgroundColor: "#101622", ...GRAD, navStyle: "pill", height: 64 },
  },
  {
    id: "frost",
    label: "Frost",
    fields: { background: "blur", backgroundColor: "#101622", ...GRAD, navStyle: "underline", height: 60 },
  },
  {
    id: "indigo",
    label: "Indigo",
    fields: { background: "solid", backgroundColor: "#4f46e5", ...GRAD, navStyle: "pill", height: 64 },
  },
  {
    id: "royal",
    label: "Royal",
    fields: { background: "solid", backgroundColor: "#1976d2", ...GRAD, navStyle: "underline", height: 64 },
  },
  {
    id: "ocean",
    label: "Ocean",
    fields: { background: "solid", backgroundColor: "#0ea5e9", ...GRAD, navStyle: "pill", height: 64 },
  },
  {
    id: "onyx",
    label: "Onyx",
    fields: { background: "solid", backgroundColor: "#0b1120", ...GRAD, navStyle: "underline", height: 68 },
  },
  {
    id: "slate",
    label: "Slate",
    fields: { background: "solid", backgroundColor: "#1e293b", ...GRAD, navStyle: "pill", height: 64 },
  },
  {
    id: "paper",
    label: "Paper",
    fields: { background: "solid", backgroundColor: "#ffffff", ...GRAD, navStyle: "underline", height: 64 },
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
  if (f.background === "solid") return { bgcolor: f.backgroundColor };
  return { background: "linear-gradient(135deg, #334155, #0f172a)" }; // glass hint
}

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(f.slice(0, 2), 16) / 255;
  const g = parseInt(f.slice(2, 4), 16) / 255;
  const b = parseInt(f.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Readable swatch foreground (for the nav-dot hints) over the preset's bg. */
export function presetSwatchFg(f: HeaderAppearanceFields): string {
  if (f.background === "solid" && luminance(f.backgroundColor) > 0.6) return "rgba(0,0,0,0.6)";
  return "rgba(255,255,255,0.85)";
}
