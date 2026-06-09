"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { useThemeStore } from "@/stores/domains";
import { THEME_PRESETS } from "@/theme/presets";
import type { ThemePreset } from "@/schemas/portfolio";
import { EditorCard, SelectInput, SwitchInput, SliderInput, ColorInput } from "./fields";

const FONTS = ["Inter", "Roboto", "Poppins", "Montserrat", "Space Grotesk", "JetBrains Mono"] as const;

export default function ThemeEditor() {
  const { theme, updateTheme } = useThemeStore();

  return (
    <Box>
      <EditorCard title="Presets" description="Apply a curated starting point, then fine-tune below.">
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
          {(Object.keys(THEME_PRESETS) as ThemePreset[]).map((key) => {
            const p = THEME_PRESETS[key];
            const active = theme.preset === key;
            return (
              <Button
                key={key}
                variant={active ? "contained" : "outlined"}
                onClick={() => updateTheme({ preset: key, ...p.def })}
                sx={{ justifyContent: "flex-start", gap: 1 }}
              >
                <Stack direction="row" spacing={0.5}>
                  <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: p.def.primaryColor }} />
                  <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: p.def.secondaryColor }} />
                </Stack>
                <Typography variant="body2">{p.label}</Typography>
              </Button>
            );
          })}
        </Box>
      </EditorCard>

      <EditorCard title="Mode">
        <SelectInput
          label="Color mode"
          value={theme.mode}
          onChange={(mode) => updateTheme({ mode })}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "system", label: "System" },
          ]}
        />
        <SwitchInput
          label="Show theme switcher in portfolio header"
          checked={theme.themeSwitcher}
          onChange={(themeSwitcher) => updateTheme({ themeSwitcher })}
        />
      </EditorCard>

      <EditorCard title="Colors">
        <ColorInput label="Primary" value={theme.primaryColor} onChange={(primaryColor) => updateTheme({ primaryColor })} />
        <ColorInput label="Secondary" value={theme.secondaryColor} onChange={(secondaryColor) => updateTheme({ secondaryColor })} />
        <ColorInput label="Background" value={theme.backgroundColor} onChange={(backgroundColor) => updateTheme({ backgroundColor })} />
        <ColorInput label="Surface" value={theme.surfaceColor} onChange={(surfaceColor) => updateTheme({ surfaceColor })} />
        <ColorInput label="Text" value={theme.textColor} onChange={(textColor) => updateTheme({ textColor })} />
      </EditorCard>

      <EditorCard title="Typography & Layout">
        <SelectInput
          label="Font family"
          value={theme.fontFamily}
          onChange={(fontFamily) => updateTheme({ fontFamily })}
          options={FONTS.map((f) => ({ value: f, label: f }))}
        />
        <SliderInput
          label="Border radius"
          value={theme.borderRadius}
          min={0}
          max={48}
          unit="px"
          onChange={(borderRadius) => updateTheme({ borderRadius })}
        />
        <SliderInput
          label="Container width"
          value={theme.containerWidth}
          min={800}
          max={1920}
          step={20}
          unit="px"
          onChange={(containerWidth) => updateTheme({ containerWidth })}
        />
      </EditorCard>
    </Box>
  );
}
