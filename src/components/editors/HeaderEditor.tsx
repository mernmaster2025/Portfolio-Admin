"use client";

import { Box, Divider, Typography } from "@mui/material";
import { useHeaderStore } from "@/stores/domains";
import {
  EditorCard,
  SelectInput,
  SwitchInput,
  SliderInput,
  ColorInput,
  TextInput,
} from "./fields";
import SocialsEditor from "./SocialsEditor";
import {
  HEADER_APPEARANCE_PRESETS,
  matchesHeaderPreset,
  presetSwatchSx,
  presetSwatchFg,
} from "@/lib/headerPresets";

export default function HeaderEditor() {
  const { header, updateHeader } = useHeaderStore();

  return (
    <Box>
      <EditorCard title="Style" collapsible>
        <SelectInput
          label="Variant"
          value={header.variant}
          onChange={(variant) => updateHeader({ variant })}
          options={[
            { value: "classic", label: "Classic" },
            { value: "centered", label: "Centered" },
            { value: "modern", label: "Modern" },
            { value: "sidebar", label: "Sidebar Navigation" },
            { value: "minimal", label: "Minimal" },
          ]}
        />
        <SelectInput
          label="Position"
          value={header.position}
          onChange={(position) => updateHeader({ position })}
          options={[
            { value: "static", label: "Static" },
            { value: "sticky", label: "Sticky" },
            { value: "fixed", label: "Fixed" },
          ]}
        />
        <SwitchInput
          label="Floating shape (rounded, inset bar)"
          checked={header.floating}
          onChange={(floating) => updateHeader({ floating })}
        />
        <SelectInput
          label="Entrance animation"
          value={header.animation}
          onChange={(animation) => updateHeader({ animation })}
          options={[
            { value: "none", label: "None" },
            { value: "fade", label: "Fade" },
            { value: "slide-down", label: "Slide Down" },
            { value: "blur", label: "Blur" },
            { value: "scale", label: "Scale" },
          ]}
        />
      </EditorCard>

      <EditorCard title="Appearance" collapsible defaultExpanded={false}>
        <Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            {HEADER_APPEARANCE_PRESETS.map((preset) => {
              const active = matchesHeaderPreset(header, preset);
              return (
                <Box
                  key={preset.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => updateHeader(preset.fields)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      updateHeader(preset.fields);
                    }
                  }}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 2,
                    p: 1,
                    border: 2,
                    borderColor: active ? "primary.main" : "divider",
                    transition: "border-color .15s ease",
                    "&:hover": { borderColor: "primary.light" },
                  }}
                >
                  <Box
                    sx={{
                      height: 38,
                      borderRadius: 1.5,
                      mb: 0.75,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      px: 1,
                      ...presetSwatchSx(preset.fields),
                    }}
                  >
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: presetSwatchFg(preset.fields) }} />
                    <Box sx={{ flex: 1 }} />
                    {[0, 1, 2].map((i) => (
                      <Box
                        key={i}
                        sx={
                          preset.fields.navStyle === "pill"
                            ? { width: 14, height: 8, borderRadius: 4, bgcolor: presetSwatchFg(preset.fields), opacity: 0.3 }
                            : { width: 12, height: 4, borderRadius: 2, bgcolor: presetSwatchFg(preset.fields), opacity: 0.8 }
                        }
                      />
                    ))}
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {preset.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          <Divider sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Customize
            </Typography>
          </Divider>
        </Box>

        <SelectInput
          label="Background"
          value={header.background === "gradient" ? "solid" : header.background}
          onChange={(background) => updateHeader({ background })}
          options={[
            { value: "blur", label: "Glass (blur)" },
            { value: "solid", label: "Solid color" },
          ]}
        />
        {header.background !== "blur" && (
          <ColorInput
            label="Background color"
            value={header.backgroundColor}
            onChange={(backgroundColor) => updateHeader({ backgroundColor })}
          />
        )}
        <SelectInput
          label="Nav item style"
          value={header.navStyle}
          onChange={(navStyle) => updateHeader({ navStyle })}
          options={[
            { value: "underline", label: "Underline" },
            { value: "pill", label: "Pill" },
          ]}
        />
        <SliderInput
          label="Header height"
          value={header.height}
          min={44}
          max={112}
          unit="px"
          onChange={(height) => updateHeader({ height })}
        />
        <SliderInput
          label="Horizontal margin"
          value={header.marginX}
          min={0}
          max={80}
          unit="px"
          onChange={(marginX) => updateHeader({ marginX })}
        />
      </EditorCard>

      <EditorCard title="Branding" collapsible defaultExpanded={false}>
        <SelectInput
          label="Logo type"
          value={header.logoType}
          onChange={(logoType) => updateHeader({ logoType })}
          options={[
            { value: "text", label: "Text" },
            { value: "image", label: "Image" },
          ]}
        />
        {header.logoType === "image" ? (
          <>
            <TextInput
              label="Logo image URL"
              value={header.logoImage}
              onChange={(logoImage) => updateHeader({ logoImage })}
              placeholder="https://…/logo.svg"
            />
            <TextInput
              label="Logo alt text"
              value={header.logoText}
              onChange={(logoText) => updateHeader({ logoText })}
            />
            <SliderInput
              label="Logo height"
              value={header.logoHeight}
              min={16}
              max={80}
              unit="px"
              onChange={(logoHeight) => updateHeader({ logoHeight })}
            />
          </>
        ) : (
          <TextInput label="Logo text" value={header.logoText} onChange={(logoText) => updateHeader({ logoText })} />
        )}
      </EditorCard>

      <EditorCard
        title="Content"
        collapsible
        defaultExpanded={false}
        description="Navigation links are generated automatically from your visible sections."
      >
        <SwitchInput label="Show logo" checked={header.showLogo} onChange={(showLogo) => updateHeader({ showLogo })} />
        <SwitchInput label="Show navigation" checked={header.showNavigation} onChange={(showNavigation) => updateHeader({ showNavigation })} />
        <SwitchInput label="Show theme switcher" checked={header.showThemeSwitcher} onChange={(showThemeSwitcher) => updateHeader({ showThemeSwitcher })} />
        <SwitchInput label="Show resume button" checked={header.showResumeButton} onChange={(showResumeButton) => updateHeader({ showResumeButton })} />
        <SwitchInput label="Show social icons" checked={header.showSocialIcons} onChange={(showSocialIcons) => updateHeader({ showSocialIcons })} />
      </EditorCard>

      <SocialsEditor collapsible />
    </Box>
  );
}
