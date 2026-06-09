import type { SectionKey } from "@/schemas/portfolio";

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string; // MUI icon name (resolved in the Sidebar)
  children?: NavChild[];
}

export const SECTION_LABELS: Record<SectionKey, string> = {
  hero: "Hero",
  about: "About",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  testimonials: "Testimonials",
  contact: "Contact",
};

export const NAV: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "Dashboard" },
  { label: "Theme", href: "/admin/theme", icon: "Palette" },
  { label: "Header", href: "/admin/header", icon: "ViewDay" },
  { label: "Footer", href: "/admin/footer", icon: "HorizontalRule" },
  {
    label: "Sections",
    href: "/admin/sections",
    icon: "Dashboard",
    children: (Object.keys(SECTION_LABELS) as SectionKey[]).map((key) => ({
      label: SECTION_LABELS[key],
      href: `/admin/sections/${key}`,
    })),
  },
  { label: "Animations", href: "/admin/animations", icon: "AutoAwesome" },
  { label: "SEO", href: "/admin/seo", icon: "Search" },
  { label: "Preview", href: "/admin/preview", icon: "Visibility" },
  { label: "Export", href: "/admin/export", icon: "Download" },
];
