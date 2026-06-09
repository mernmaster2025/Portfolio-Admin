"use client";

import { Box } from "@mui/material";
import { useSection, useSectionStore } from "@/stores/domains";
import { EditorCard, SelectInput, SwitchInput, TextInput, ChipsInput } from "../fields";

export default function HeroSectionEditor() {
  const hero = useSection("hero");
  const { updateSection } = useSectionStore();
  const set = (patch: Partial<typeof hero>) => updateSection("hero", patch);

  return (
    <Box>
      <EditorCard title="Layout">
        <SelectInput
          label="Variant"
          value={hero.variant}
          onChange={(variant) => set({ variant })}
          options={[
            { value: "centered", label: "V1 — Centered" },
            { value: "split", label: "V2 — Split Layout" },
            { value: "fullscreen", label: "V3 — Fullscreen" },
            { value: "minimal", label: "V4 — Minimal" },
            { value: "video", label: "V5 — Video Background" },
          ]}
        />
        <SwitchInput label="Show photo" checked={hero.showPhoto} onChange={(v) => set({ showPhoto: v })} />
        <SwitchInput label="Typing effect" checked={hero.showTypingEffect} onChange={(v) => set({ showTypingEffect: v })} />
        <SwitchInput label="Resume button" checked={hero.showResumeButton} onChange={(v) => set({ showResumeButton: v })} />
        <SwitchInput label="Social links" checked={hero.showSocialLinks} onChange={(v) => set({ showSocialLinks: v })} />
      </EditorCard>

      <EditorCard title="Content">
        <TextInput label="Name" value={hero.name} onChange={(name) => set({ name })} />
        <TextInput label="Title" value={hero.title} onChange={(title) => set({ title })} />
        <ChipsInput label="Typing roles" values={hero.roles} onChange={(roles) => set({ roles })} />
        <TextInput label="Description" multiline value={hero.description} onChange={(description) => set({ description })} />
        <TextInput label="Profile image URL" value={hero.profileImage} onChange={(profileImage) => set({ profileImage })} placeholder="https://…" />
        <TextInput label="Resume URL" value={hero.resumeUrl} onChange={(resumeUrl) => set({ resumeUrl })} placeholder="https://…/resume.pdf" />
      </EditorCard>

      <EditorCard title="Call to action">
        <TextInput label="Primary label" value={hero.primaryCtaLabel} onChange={(primaryCtaLabel) => set({ primaryCtaLabel })} />
        <TextInput label="Primary link" value={hero.primaryCtaHref} onChange={(primaryCtaHref) => set({ primaryCtaHref })} />
        <TextInput label="Secondary label" value={hero.secondaryCtaLabel} onChange={(secondaryCtaLabel) => set({ secondaryCtaLabel })} />
        <TextInput label="Secondary link" value={hero.secondaryCtaHref} onChange={(secondaryCtaHref) => set({ secondaryCtaHref })} />
      </EditorCard>
    </Box>
  );
}
