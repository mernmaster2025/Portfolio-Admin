"use client";

import { Box } from "@mui/material";
import { useHeaderStore } from "@/stores/domains";
import { EditorCard, SelectInput, SwitchInput, TextInput } from "./fields";
import SocialsEditor from "./SocialsEditor";

export default function HeaderEditor() {
  const { header, updateHeader } = useHeaderStore();

  return (
    <Box>
      <EditorCard title="Style">
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
            { value: "floating", label: "Floating" },
          ]}
        />
        <SelectInput
          label="Animation"
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

      <EditorCard title="Branding">
        <TextInput label="Logo text" value={header.logoText} onChange={(logoText) => updateHeader({ logoText })} />
      </EditorCard>

      <EditorCard title="Content" description="Navigation links are generated automatically from your visible sections.">
        <SwitchInput label="Show logo" checked={header.showLogo} onChange={(showLogo) => updateHeader({ showLogo })} />
        <SwitchInput label="Show navigation" checked={header.showNavigation} onChange={(showNavigation) => updateHeader({ showNavigation })} />
        <SwitchInput label="Show theme switcher" checked={header.showThemeSwitcher} onChange={(showThemeSwitcher) => updateHeader({ showThemeSwitcher })} />
        <SwitchInput label="Show resume button" checked={header.showResumeButton} onChange={(showResumeButton) => updateHeader({ showResumeButton })} />
        <SwitchInput label="Show social icons" checked={header.showSocialIcons} onChange={(showSocialIcons) => updateHeader({ showSocialIcons })} />
      </EditorCard>

      <SocialsEditor />
    </Box>
  );
}
