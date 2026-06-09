"use client";

import { Box } from "@mui/material";
import { useSection, useSectionStore } from "@/stores/domains";
import { EditorCard, SelectInput, TextInput } from "../fields";
import { ItemList, newId } from "../ItemList";

export default function TestimonialsSectionEditor() {
  const t = useSection("testimonials");
  const { updateSection } = useSectionStore();
  const set = (patch: Partial<typeof t>) => updateSection("testimonials", patch);

  return (
    <Box>
      <EditorCard title="Layout">
        <SelectInput
          label="Variant"
          value={t.variant}
          onChange={(variant) => set({ variant })}
          options={[
            { value: "cards", label: "Cards" },
            { value: "carousel", label: "Carousel" },
            { value: "grid", label: "Grid" },
          ]}
        />
        <TextInput label="Heading" value={t.heading} onChange={(heading) => set({ heading })} />
      </EditorCard>

      <EditorCard title="Testimonials">
        <ItemList
          items={t.items}
          onChange={(items) => set({ items })}
          makeNew={() => ({ id: newId("tst"), name: "Name", company: "", position: "", avatar: "", quote: "" })}
          addLabel="Add testimonial"
          title={(x) => x.name}
          renderItem={(item, update) => (
            <>
              <TextInput label="Name" value={item.name} onChange={(name) => update({ name })} />
              <TextInput label="Position" value={item.position} onChange={(position) => update({ position })} />
              <TextInput label="Company" value={item.company} onChange={(company) => update({ company })} />
              <TextInput label="Avatar URL" value={item.avatar} onChange={(avatar) => update({ avatar })} placeholder="https://…" />
              <TextInput label="Quote" multiline value={item.quote} onChange={(quote) => update({ quote })} />
            </>
          )}
        />
      </EditorCard>
    </Box>
  );
}
