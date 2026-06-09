"use client";

import { Box } from "@mui/material";
import { useSection, useSectionStore } from "@/stores/domains";
import { EditorCard, SelectInput, SwitchInput, TextInput, ChipsInput } from "../fields";
import { ItemList, newId } from "../ItemList";

export default function AboutSectionEditor() {
  const about = useSection("about");
  const { updateSection } = useSectionStore();
  const set = (patch: Partial<typeof about>) => updateSection("about", patch);

  return (
    <Box>
      <EditorCard title="Layout">
        <SelectInput
          label="Variant"
          value={about.variant}
          onChange={(variant) => set({ variant })}
          options={[
            { value: "classic", label: "Classic" },
            { value: "timeline", label: "Timeline" },
            { value: "cards", label: "Cards" },
            { value: "modern", label: "Modern" },
          ]}
        />
        <SwitchInput label="Show stats" checked={about.showStats} onChange={(v) => set({ showStats: v })} />
        <SwitchInput label="Show skills note" checked={about.showSkills} onChange={(v) => set({ showSkills: v })} />
      </EditorCard>

      <EditorCard title="Content">
        <TextInput label="Heading" value={about.heading} onChange={(heading) => set({ heading })} />
        <TextInput label="Description" multiline value={about.description} onChange={(description) => set({ description })} />
        <ChipsInput label="Highlights" values={about.highlights} onChange={(highlights) => set({ highlights })} />
      </EditorCard>

      <EditorCard title="Statistics">
        <ItemList
          items={about.stats}
          onChange={(stats) => set({ stats })}
          makeNew={() => ({ id: newId("stat"), label: "New stat", value: "0" })}
          addLabel="Add statistic"
          title={(s) => s.label || "Statistic"}
          renderItem={(item, update) => (
            <>
              <TextInput label="Label" value={item.label} onChange={(label) => update({ label })} />
              <TextInput label="Value" value={item.value} onChange={(value) => update({ value })} />
            </>
          )}
        />
      </EditorCard>
    </Box>
  );
}
