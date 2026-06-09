"use client";

import { Box } from "@mui/material";
import { useSection, useSectionStore } from "@/stores/domains";
import { EditorCard, SelectInput, SwitchInput, TextInput } from "../fields";

export default function ContactSectionEditor() {
  const c = useSection("contact");
  const { updateSection } = useSectionStore();
  const set = (patch: Partial<typeof c>) => updateSection("contact", patch);

  return (
    <Box>
      <EditorCard title="Layout">
        <SelectInput
          label="Variant"
          value={c.variant}
          onChange={(variant) => set({ variant })}
          options={[
            { value: "simple", label: "Simple Form" },
            { value: "split", label: "Split Layout" },
            { value: "map", label: "Map Layout" },
            { value: "cards", label: "Cards" },
          ]}
        />
        <SwitchInput label="Show contact form" checked={c.showContactForm} onChange={(v) => set({ showContactForm: v })} />
        <SwitchInput label="Show map" checked={c.showMap} onChange={(v) => set({ showMap: v })} />
      </EditorCard>

      <EditorCard title="Content">
        <TextInput label="Heading" value={c.heading} onChange={(heading) => set({ heading })} />
        <TextInput label="Description" multiline value={c.description} onChange={(description) => set({ description })} />
        <TextInput label="Email" value={c.email} onChange={(email) => set({ email })} />
        <TextInput label="Phone" value={c.phone} onChange={(phone) => set({ phone })} />
        <TextInput label="Address" value={c.address} onChange={(address) => set({ address })} />
      </EditorCard>
    </Box>
  );
}
