"use client";

import { Box } from "@mui/material";
import { useSection, useSectionStore } from "@/stores/domains";
import { EditorCard, SelectInput, SliderInput, TextInput } from "../fields";
import { ItemList, newId } from "../ItemList";

export default function SkillsSectionEditor() {
  const skills = useSection("skills");
  const { updateSection } = useSectionStore();
  const set = (patch: Partial<typeof skills>) => updateSection("skills", patch);

  return (
    <Box>
      <EditorCard title="Layout">
        <SelectInput
          label="Variant"
          value={skills.variant}
          onChange={(variant) => set({ variant })}
          options={[
            { value: "progress", label: "Progress Bars" },
            { value: "cards", label: "Cards" },
            { value: "tags", label: "Tags" },
            { value: "timeline", label: "Timeline" },
          ]}
        />
        <TextInput label="Heading" value={skills.heading} onChange={(heading) => set({ heading })} />
      </EditorCard>

      <EditorCard title="Skills">
        <ItemList
          items={skills.items}
          onChange={(items) => set({ items })}
          makeNew={() => ({ id: newId("skill"), name: "New skill", category: "General", percentage: 80, icon: "" })}
          addLabel="Add skill"
          title={(s) => s.name || "Skill"}
          renderItem={(item, update) => (
            <>
              <TextInput label="Name" value={item.name} onChange={(name) => update({ name })} />
              <TextInput label="Category" value={item.category} onChange={(category) => update({ category })} />
              <SliderInput label="Proficiency" value={item.percentage} min={0} max={100} unit="%" onChange={(percentage) => update({ percentage })} />
            </>
          )}
        />
      </EditorCard>
    </Box>
  );
}
