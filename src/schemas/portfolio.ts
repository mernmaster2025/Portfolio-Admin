import { z } from "zod";

/**
 * Portfolio schema — the single source of truth for the entire platform.
 *
 * Both the admin builder and the exported standalone site render exclusively
 * from a value matching `portfolioSchema`. All TypeScript types are inferred
 * from these Zod schemas so validation and types never drift apart.
 */

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

const hexColor = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Must be a valid hex color");

const urlOrEmpty = z.union([z.string().url("Must be a valid URL"), z.literal("")]);

export const socialLinkSchema = z.object({
  id: z.string(),
  platform: z.enum([
    "github",
    "linkedin",
    "twitter",
    "instagram",
    "facebook",
    "youtube",
    "dribbble",
    "behance",
    "website",
    "email",
  ]),
  url: z.string().min(1, "URL is required"),
});
export type SocialLink = z.infer<typeof socialLinkSchema>;

/* ------------------------------------------------------------------ */
/* Theme                                                               */
/* ------------------------------------------------------------------ */

export const themeModeSchema = z.enum(["light", "dark", "system"]);
export type ThemeMode = z.infer<typeof themeModeSchema>;

export const themePresetSchema = z.enum([
  "minimal",
  "developer",
  "corporate",
  "cyberpunk",
  "glassmorphism",
  "creative",
]);
export type ThemePreset = z.infer<typeof themePresetSchema>;

export const themeSchema = z.object({
  mode: themeModeSchema.default("dark"),
  themeSwitcher: z.boolean().default(true),
  preset: themePresetSchema.default("developer"),
  primaryColor: hexColor.default("#2563eb"),
  secondaryColor: hexColor.default("#8b5cf6"),
  backgroundColor: hexColor.default("#0b0f17"),
  surfaceColor: hexColor.default("#121826"),
  textColor: hexColor.default("#e6edf3"),
  fontFamily: z
    .enum(["Inter", "Roboto", "Poppins", "Montserrat", "Space Grotesk", "JetBrains Mono"])
    .default("Inter"),
  borderRadius: z.number().min(0).max(48).default(16),
  containerWidth: z.number().min(800).max(1920).default(1200),
});
export type ThemeConfig = z.infer<typeof themeSchema>;

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

export const headerSchema = z.object({
  variant: z
    .enum(["classic", "centered", "modern", "sidebar", "minimal"])
    .default("modern"),
  // Position behaviour:
  //  static — scrolls with the page
  //  fixed  — always pinned and visible at the top
  //  sticky — pinned, but hides on scroll down and reveals on scroll up
  position: z.enum(["static", "sticky", "fixed"]).default("sticky"),
  // Shape, independent of position: a rounded, inset "floating" bar.
  floating: z.boolean().default(false),
  animation: z
    .enum(["none", "fade", "slide-down", "blur", "scale"])
    .default("slide-down"),
  showLogo: z.boolean().default(true),
  logoType: z.enum(["text", "image"]).default("text"),
  logoText: z.string().default("Portfolio"),
  logoImage: z.string().default(""),
  logoHeight: z.number().min(16).max(80).default(32),
  showNavigation: z.boolean().default(true),
  showThemeSwitcher: z.boolean().default(true),
  showResumeButton: z.boolean().default(true),
  showSocialIcons: z.boolean().default(true),
  // Appearance:
  //  blur — translucent glass (backdrop blur); solid — flat colour;
  //  gradient — linear gradient; transparent — no background.
  background: z.enum(["blur", "solid", "gradient", "transparent"]).default("blur"),
  backgroundColor: hexColor.default("#101622"),
  gradientFrom: hexColor.default("#2563eb"),
  gradientTo: hexColor.default("#8b5cf6"),
  gradientAngle: z.number().min(0).max(360).default(135),
  // Active / hover style for the nav links.
  navStyle: z.enum(["text", "underline", "pill"]).default("text"),
  height: z.number().min(44).max(112).default(64),
  showBorder: z.boolean().default(false),
});
export type HeaderConfig = z.infer<typeof headerSchema>;

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export const footerSchema = z.object({
  variant: z
    .enum(["minimal", "developer", "corporate", "centered", "multi-column"])
    .default("corporate"),
  columns: z.number().min(1).max(4).default(4),
  copyrightText: z.string().default("All rights reserved."),
  showCopyright: z.boolean().default(true),
  showSocialLinks: z.boolean().default(true),
  showQuickLinks: z.boolean().default(true),
  showContactInfo: z.boolean().default(true),
});
export type FooterConfig = z.infer<typeof footerSchema>;

/* ------------------------------------------------------------------ */
/* Sections — content + per-section config                            */
/* ------------------------------------------------------------------ */

export const sectionKeys = [
  "hero",
  "about",
  "skills",
  "experience",
  "projects",
  "testimonials",
  "contact",
] as const;
export const sectionKeySchema = z.enum(sectionKeys);
export type SectionKey = z.infer<typeof sectionKeySchema>;

/* Hero */
export const heroSchema = z.object({
  variant: z.enum(["centered", "split", "fullscreen", "minimal", "video"]).default("split"),
  showPhoto: z.boolean().default(true),
  showTypingEffect: z.boolean().default(true),
  showResumeButton: z.boolean().default(true),
  showSocialLinks: z.boolean().default(true),
  name: z.string().min(1, "Name is required").default("Jordan Rivera"),
  title: z.string().default("Full-Stack Developer"),
  roles: z.array(z.string()).default(["Full-Stack Developer", "UI Engineer", "Open Sourcerer"]),
  description: z
    .string()
    .default("I design and build performant, accessible web experiences end to end."),
  profileImage: z.string().default(""),
  resumeUrl: z.string().default(""),
  primaryCtaLabel: z.string().default("View Projects"),
  primaryCtaHref: z.string().default("#projects"),
  secondaryCtaLabel: z.string().default("Contact Me"),
  secondaryCtaHref: z.string().default("#contact"),
});

/* About */
export const aboutStatSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
});
export const aboutSchema = z.object({
  variant: z.enum(["classic", "timeline", "cards", "modern"]).default("modern"),
  showStats: z.boolean().default(true),
  showSkills: z.boolean().default(true),
  heading: z.string().default("About Me"),
  description: z
    .string()
    .default(
      "I'm a developer with a passion for clean architecture and delightful interfaces. Over the years I've shipped products across fintech, health, and developer tooling."
    ),
  highlights: z.array(z.string()).default(["Clean code advocate", "Design systems", "Mentorship"]),
  stats: z
    .array(aboutStatSchema)
    .default([
      { id: "s1", label: "Years Experience", value: "8+" },
      { id: "s2", label: "Projects Shipped", value: "120+" },
      { id: "s3", label: "Happy Clients", value: "45" },
    ]),
});

/* Skills */
export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  category: z.string().default("General"),
  percentage: z.number().min(0).max(100).default(80),
  icon: z.string().default(""),
});
export const skillsSchema = z.object({
  variant: z.enum(["progress", "cards", "tags", "timeline"]).default("progress"),
  heading: z.string().default("Skills"),
  items: z
    .array(skillSchema)
    .default([
      { id: "k1", name: "TypeScript", category: "Languages", percentage: 92, icon: "" },
      { id: "k2", name: "React / Next.js", category: "Frontend", percentage: 95, icon: "" },
      { id: "k3", name: "Node.js", category: "Backend", percentage: 88, icon: "" },
      { id: "k4", name: "PostgreSQL", category: "Data", percentage: 80, icon: "" },
    ]),
});

/* Experience */
export const experienceItemSchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  position: z.string().min(1),
  location: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  current: z.boolean().default(false),
  description: z.string().default(""),
  technologies: z.array(z.string()).default([]),
});
export const experienceSchema = z.object({
  variant: z.enum(["timeline", "cards", "list", "modern"]).default("timeline"),
  heading: z.string().default("Experience"),
  items: z
    .array(experienceItemSchema)
    .default([
      {
        id: "e1",
        company: "Acme Corp",
        position: "Senior Software Engineer",
        location: "Remote",
        startDate: "2021",
        endDate: "",
        current: true,
        description: "Lead frontend for the core product, mentoring a team of five.",
        technologies: ["React", "Next.js", "GraphQL"],
      },
      {
        id: "e2",
        company: "Startup Labs",
        position: "Software Engineer",
        location: "Berlin",
        startDate: "2018",
        endDate: "2021",
        current: false,
        description: "Built the design system and internal tooling from scratch.",
        technologies: ["TypeScript", "Node.js"],
      },
    ]),
});

/* Projects */
export const projectItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().default(""),
  image: z.string().default(""),
  technologies: z.array(z.string()).default([]),
  category: z.string().default("Web"),
  githubUrl: urlOrEmpty.default(""),
  liveUrl: urlOrEmpty.default(""),
  featured: z.boolean().default(false),
});
export const projectsSchema = z.object({
  variant: z.enum(["grid", "masonry", "carousel", "cards"]).default("grid"),
  heading: z.string().default("Projects"),
  columns: z.number().min(1).max(4).default(3),
  showFilters: z.boolean().default(true),
  showGithub: z.boolean().default(true),
  showDemo: z.boolean().default(true),
  items: z
    .array(projectItemSchema)
    .default([
      {
        id: "p1",
        title: "DevBoard",
        description: "A real-time kanban board for engineering teams.",
        image: "",
        technologies: ["Next.js", "tRPC", "Postgres"],
        category: "Web",
        githubUrl: "",
        liveUrl: "",
        featured: true,
      },
      {
        id: "p2",
        title: "PixelPay",
        description: "Lightweight payments SDK with delightful DX.",
        image: "",
        technologies: ["TypeScript", "Stripe"],
        category: "SDK",
        githubUrl: "",
        liveUrl: "",
        featured: false,
      },
      {
        id: "p3",
        title: "Lumen UI",
        description: "An accessible, themeable component library.",
        image: "",
        technologies: ["React", "Emotion"],
        category: "Library",
        githubUrl: "",
        liveUrl: "",
        featured: false,
      },
    ]),
});

/* Testimonials */
export const testimonialItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  company: z.string().default(""),
  position: z.string().default(""),
  avatar: z.string().default(""),
  quote: z.string().default(""),
});
export const testimonialsSchema = z.object({
  variant: z.enum(["cards", "carousel", "grid"]).default("cards"),
  heading: z.string().default("Testimonials"),
  items: z
    .array(testimonialItemSchema)
    .default([
      {
        id: "t1",
        name: "Sam Carter",
        company: "Acme Corp",
        position: "CTO",
        avatar: "",
        quote: "One of the most reliable engineers I've worked with. Ships fast, ships clean.",
      },
      {
        id: "t2",
        name: "Priya Nair",
        company: "Startup Labs",
        position: "Product Lead",
        avatar: "",
        quote: "Turned our vague ideas into a polished product the users love.",
      },
    ]),
});

/* Contact */
export const contactSchema = z.object({
  variant: z.enum(["simple", "split", "map", "cards"]).default("split"),
  heading: z.string().default("Get In Touch"),
  description: z.string().default("Have a project in mind? Let's talk."),
  email: z.string().default("hello@example.com"),
  phone: z.string().default(""),
  address: z.string().default(""),
  showContactForm: z.boolean().default(true),
  showMap: z.boolean().default(false),
});

/* ------------------------------------------------------------------ */
/* Section manager (order + visibility)                                */
/* ------------------------------------------------------------------ */

export const sectionsConfigSchema = z.object({
  order: z.array(sectionKeySchema).default([...sectionKeys]),
  visibility: z
    .object({
      hero: z.boolean().default(true),
      about: z.boolean().default(true),
      skills: z.boolean().default(true),
      experience: z.boolean().default(true),
      projects: z.boolean().default(true),
      testimonials: z.boolean().default(true),
      contact: z.boolean().default(true),
    })
    .default({
      hero: true,
      about: true,
      skills: true,
      experience: true,
      projects: true,
      testimonials: true,
      contact: true,
    }),
  hero: heroSchema.prefault({}),
  about: aboutSchema.prefault({}),
  skills: skillsSchema.prefault({}),
  experience: experienceSchema.prefault({}),
  projects: projectsSchema.prefault({}),
  testimonials: testimonialsSchema.prefault({}),
  contact: contactSchema.prefault({}),
});
export type SectionsConfig = z.infer<typeof sectionsConfigSchema>;

/* ------------------------------------------------------------------ */
/* Animations                                                          */
/* ------------------------------------------------------------------ */

export const animationsSchema = z.object({
  preset: z.enum(["none", "minimal", "smooth", "dynamic", "futuristic"]).default("smooth"),
  pageTransitions: z.boolean().default(true),
  scrollReveal: z.boolean().default(true),
  sectionAnimation: z.boolean().default(true),
  heroAnimation: z.boolean().default(true),
  cursorEffects: z.boolean().default(false),
  particleEffects: z.boolean().default(false),
});
export type AnimationsConfig = z.infer<typeof animationsSchema>;

/* ------------------------------------------------------------------ */
/* SEO                                                                 */
/* ------------------------------------------------------------------ */

export const seoSchema = z.object({
  metaTitle: z.string().default("Jordan Rivera — Full-Stack Developer"),
  metaDescription: z
    .string()
    .default("Portfolio of Jordan Rivera, a full-stack developer building delightful web apps."),
  keywords: z.array(z.string()).default(["developer", "portfolio", "react", "next.js"]),
  ogImage: z.string().default(""),
  twitterImage: z.string().default(""),
  canonicalUrl: urlOrEmpty.default(""),
});
export type SeoConfig = z.infer<typeof seoSchema>;

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

export const portfolioSchema = z.object({
  theme: themeSchema.prefault({}),
  header: headerSchema.prefault({}),
  footer: footerSchema.prefault({}),
  sections: sectionsConfigSchema.prefault({}),
  animations: animationsSchema.prefault({}),
  seo: seoSchema.prefault({}),
  socials: z
    .array(socialLinkSchema)
    .default([
      { id: "sl1", platform: "github", url: "https://github.com" },
      { id: "sl2", platform: "linkedin", url: "https://linkedin.com" },
      { id: "sl3", platform: "twitter", url: "https://twitter.com" },
    ]),
});

export type Portfolio = z.infer<typeof portfolioSchema>;

/**
 * Build a fully-defaulted, valid Portfolio object.
 *
 * Zod applies a field's `.default()` only when that field is *absent*, and it
 * does not re-parse a default value through its inner schema. So we pass a
 * skeleton where every nested object key is present (as `{}`) — that forces
 * each sub-schema to run and apply its own field-level defaults, yielding a
 * deeply-populated object instead of shallow empties.
 */
export function createDefaultPortfolio(): Portfolio {
  return portfolioSchema.parse({
    theme: {},
    header: {},
    footer: {},
    sections: {
      visibility: {},
      hero: {},
      about: {},
      skills: {},
      experience: {},
      projects: {},
      testimonials: {},
      contact: {},
    },
    animations: {},
    seo: {},
  });
}
