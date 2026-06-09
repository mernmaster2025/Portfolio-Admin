"use client";

import { Box } from "@mui/material";
import { useSection, useSectionStore } from "@/stores/domains";
import { EditorCard, SelectInput, SwitchInput, TextInput, ChipsInput } from "../fields";
import { ItemList, newId } from "../ItemList";

export default function ExperienceSectionEditor() {
  const exp = useSection("experience");
  const { updateSection } = useSectionStore();
  const set = (patch: Partial<typeof exp>) => updateSection("experience", patch);

  return (
    <Box>
      <EditorCard title="Layout">
        <SelectInput
          label="Variant"
          value={exp.variant}
          onChange={(variant) => set({ variant })}
          options={[
            { value: "timeline", label: "Timeline" },
            { value: "cards", label: "Cards" },
            { value: "list", label: "List" },
            { value: "modern", label: "Modern" },
          ]}
        />
        <TextInput label="Heading" value={exp.heading} onChange={(heading) => set({ heading })} />
      </EditorCard>

      <EditorCard title="Positions">
        <ItemList
          items={exp.items}
          onChange={(items) => set({ items })}
          makeNew={() => ({
            id: newId("exp"),
            company: "Company",
            position: "Position",
            location: "",
            startDate: "",
            endDate: "",
            current: false,
            description: "",
            technologies: [],
          })}
          addLabel="Add position"
          title={(e) => `${e.position} · ${e.company}`}
          renderItem={(item, update) => (
            <>
              <TextInput label="Company" value={item.company} onChange={(company) => update({ company })} />
              <TextInput label="Position" value={item.position} onChange={(position) => update({ position })} />
              <TextInput label="Location" value={item.location} onChange={(location) => update({ location })} />
              <TextInput label="Start date" value={item.startDate} onChange={(startDate) => update({ startDate })} placeholder="2021" />
              <TextInput label="End date" value={item.endDate} onChange={(endDate) => update({ endDate })} placeholder="2023" />
              <SwitchInput label="Current role" checked={item.current} onChange={(current) => update({ current })} />
              <TextInput label="Description" multiline value={item.description} onChange={(description) => update({ description })} />
              <ChipsInput label="Technologies" values={item.technologies} onChange={(technologies) => update({ technologies })} />
            </>
          )}
        />
      </EditorCard>
    </Box>
  );
}
