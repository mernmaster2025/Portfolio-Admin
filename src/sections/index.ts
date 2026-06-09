import type { SectionKey } from "@/schemas/portfolio";
import { Hero } from "./Hero";
import { About } from "./About";
import { Skills } from "./Skills";
import { Experience } from "./Experience";
import { Projects } from "./Projects";
import { Testimonials } from "./Testimonials";
import { Contact } from "./Contact";

export const SECTION_COMPONENTS: Record<SectionKey, React.ComponentType> = {
  hero: Hero,
  about: About,
  skills: Skills,
  experience: Experience,
  projects: Projects,
  testimonials: Testimonials,
  contact: Contact,
};
