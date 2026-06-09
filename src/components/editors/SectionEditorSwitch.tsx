"use client";

import HeroSectionEditor from "./sections/HeroSectionEditor";
import AboutSectionEditor from "./sections/AboutSectionEditor";
import SkillsSectionEditor from "./sections/SkillsSectionEditor";
import ExperienceSectionEditor from "./sections/ExperienceSectionEditor";
import ProjectsSectionEditor from "./sections/ProjectsSectionEditor";
import TestimonialsSectionEditor from "./sections/TestimonialsSectionEditor";
import ContactSectionEditor from "./sections/ContactSectionEditor";
import type { SectionKey } from "@/schemas/portfolio";

const MAP: Record<SectionKey, React.ComponentType> = {
  hero: HeroSectionEditor,
  about: AboutSectionEditor,
  skills: SkillsSectionEditor,
  experience: ExperienceSectionEditor,
  projects: ProjectsSectionEditor,
  testimonials: TestimonialsSectionEditor,
  contact: ContactSectionEditor,
};

export default function SectionEditorSwitch({ section }: { section: SectionKey }) {
  const Editor = MAP[section];
  if (!Editor) return null;
  return <Editor />;
}
