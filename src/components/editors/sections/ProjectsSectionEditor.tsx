"use client";

import { Box } from "@mui/material";
import { useSection, useSectionStore } from "@/stores/domains";
import { EditorCard, SelectInput, SwitchInput, SliderInput, TextInput, ChipsInput } from "../fields";
import { ItemList, newId } from "../ItemList";

export default function ProjectsSectionEditor() {
  const projects = useSection("projects");
  const { updateSection } = useSectionStore();
  const set = (patch: Partial<typeof projects>) => updateSection("projects", patch);

  return (
    <Box>
      <EditorCard title="Layout">
        <SelectInput
          label="Variant"
          value={projects.variant}
          onChange={(variant) => set({ variant })}
          options={[
            { value: "grid", label: "Grid" },
            { value: "masonry", label: "Masonry" },
            { value: "carousel", label: "Carousel" },
            { value: "cards", label: "Cards" },
          ]}
        />
        <TextInput label="Heading" value={projects.heading} onChange={(heading) => set({ heading })} />
        <SliderInput label="Columns" value={projects.columns} min={1} max={4} onChange={(columns) => set({ columns })} />
        <SwitchInput label="Show filters" checked={projects.showFilters} onChange={(v) => set({ showFilters: v })} />
        <SwitchInput label="Show GitHub links" checked={projects.showGithub} onChange={(v) => set({ showGithub: v })} />
        <SwitchInput label="Show demo links" checked={projects.showDemo} onChange={(v) => set({ showDemo: v })} />
      </EditorCard>

      <EditorCard title="Projects">
        <ItemList
          items={projects.items}
          onChange={(items) => set({ items })}
          makeNew={() => ({
            id: newId("proj"),
            title: "New Project",
            description: "",
            image: "",
            technologies: [],
            category: "Web",
            githubUrl: "",
            liveUrl: "",
            featured: false,
          })}
          addLabel="Add project"
          title={(p) => p.title}
          renderItem={(item, update) => (
            <>
              <TextInput label="Title" value={item.title} onChange={(title) => update({ title })} />
              <TextInput label="Description" multiline value={item.description} onChange={(description) => update({ description })} />
              <TextInput label="Category" value={item.category} onChange={(category) => update({ category })} />
              <TextInput label="Image URL" value={item.image} onChange={(image) => update({ image })} placeholder="https://…" />
              <ChipsInput label="Technologies" values={item.technologies} onChange={(technologies) => update({ technologies })} />
              <TextInput label="GitHub URL" value={item.githubUrl} onChange={(githubUrl) => update({ githubUrl })} placeholder="https://github.com/…" />
              <TextInput label="Live URL" value={item.liveUrl} onChange={(liveUrl) => update({ liveUrl })} placeholder="https://…" />
              <SwitchInput label="Featured" checked={item.featured} onChange={(featured) => update({ featured })} />
            </>
          )}
        />
      </EditorCard>
    </Box>
  );
}
