"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Portfolio,
  type ThemeConfig,
  type HeaderConfig,
  type FooterConfig,
  type AnimationsConfig,
  type SeoConfig,
  type SectionsConfig,
  type SectionKey,
  type SocialLink,
  portfolioSchema,
  createDefaultPortfolio,
} from "@/schemas/portfolio";

/**
 * The master store. The whole platform is schema-driven, so there is a single
 * source of truth: `data` (a valid `Portfolio`). Domain-specific stores
 * (themeStore, headerStore, …) are thin selector hooks layered over this one
 * (see ./domains.ts), which keeps the live preview perfectly in sync.
 */

type SectionContent = SectionsConfig[SectionKey];

interface PortfolioState {
  data: Portfolio;
  /** True once the persisted state has rehydrated on the client. */
  hydrated: boolean;

  setHydrated: (v: boolean) => void;
  replaceAll: (data: Portfolio) => void;

  updateTheme: (patch: Partial<ThemeConfig>) => void;
  updateHeader: (patch: Partial<HeaderConfig>) => void;
  updateFooter: (patch: Partial<FooterConfig>) => void;
  updateAnimations: (patch: Partial<AnimationsConfig>) => void;
  updateSeo: (patch: Partial<SeoConfig>) => void;

  setSocials: (socials: SocialLink[]) => void;

  updateSection: <K extends SectionKey>(
    key: K,
    patch: Partial<SectionsConfig[K]>
  ) => void;
  setSectionOrder: (order: SectionKey[]) => void;
  toggleSectionVisibility: (key: SectionKey) => void;

  reset: () => void;
  /** Validate arbitrary input and load it. Returns a discriminated result. */
  importData: (
    input: unknown
  ) => { success: true } | { success: false; error: string };
  exportData: () => Portfolio;
}

const STORAGE_KEY = "portfolio-builder:v1";

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      data: createDefaultPortfolio(),
      hydrated: false,

      setHydrated: (v) => set({ hydrated: v }),
      replaceAll: (data) => set({ data }),

      updateTheme: (patch) =>
        set((s) => ({ data: { ...s.data, theme: { ...s.data.theme, ...patch } } })),
      updateHeader: (patch) =>
        set((s) => ({ data: { ...s.data, header: { ...s.data.header, ...patch } } })),
      updateFooter: (patch) =>
        set((s) => ({ data: { ...s.data, footer: { ...s.data.footer, ...patch } } })),
      updateAnimations: (patch) =>
        set((s) => ({
          data: { ...s.data, animations: { ...s.data.animations, ...patch } },
        })),
      updateSeo: (patch) =>
        set((s) => ({ data: { ...s.data, seo: { ...s.data.seo, ...patch } } })),

      setSocials: (socials) => set((s) => ({ data: { ...s.data, socials } })),

      updateSection: (key, patch) =>
        set((s) => ({
          data: {
            ...s.data,
            sections: {
              ...s.data.sections,
              [key]: { ...(s.data.sections[key] as SectionContent), ...patch },
            },
          },
        })),

      setSectionOrder: (order) =>
        set((s) => ({
          data: { ...s.data, sections: { ...s.data.sections, order } },
        })),

      toggleSectionVisibility: (key) =>
        set((s) => ({
          data: {
            ...s.data,
            sections: {
              ...s.data.sections,
              visibility: {
                ...s.data.sections.visibility,
                [key]: !s.data.sections.visibility[key],
              },
            },
          },
        })),

      reset: () => set({ data: createDefaultPortfolio() }),

      importData: (input) => {
        const parsed = portfolioSchema.safeParse(input);
        if (!parsed.success) {
          return {
            success: false,
            error: parsed.error.issues
              .slice(0, 5)
              .map((i) => `${i.path.join(".") || "root"}: ${i.message}`)
              .join("; "),
          };
        }
        set({ data: parsed.data });
        return { success: true };
      },

      exportData: () => get().data,
    }),
    {
      name: STORAGE_KEY,
      partialize: (s) => ({ data: s.data }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      // Defensively re-validate persisted data; fall back to defaults if the
      // schema has changed in a breaking way since it was saved.
      merge: (persisted, current) => {
        const candidate = (persisted as { data?: unknown } | undefined)?.data;
        const parsed = portfolioSchema.safeParse(candidate);
        return { ...current, data: parsed.success ? parsed.data : current.data };
      },
    }
  )
);
