"use client";

/**
 * Domain stores: ergonomic, scoped hooks over the single `usePortfolioStore`.
 *
 * These satisfy the "themeStore / headerStore / footerStore / sectionStore /
 * animationStore / seoStore" structure while preserving one source of truth,
 * so every edit is reflected in the live preview with no extra wiring.
 */
import { usePortfolioStore } from "./portfolioStore";
import type { SectionKey, SectionsConfig } from "@/schemas/portfolio";

export const useHydrated = () => usePortfolioStore((s) => s.hydrated);

export const useThemeStore = () => ({
  theme: usePortfolioStore((s) => s.data.theme),
  updateTheme: usePortfolioStore((s) => s.updateTheme),
});

export const useHeaderStore = () => ({
  header: usePortfolioStore((s) => s.data.header),
  updateHeader: usePortfolioStore((s) => s.updateHeader),
});

export const useFooterStore = () => ({
  footer: usePortfolioStore((s) => s.data.footer),
  updateFooter: usePortfolioStore((s) => s.updateFooter),
});

export const useAnimationStore = () => ({
  animations: usePortfolioStore((s) => s.data.animations),
  updateAnimations: usePortfolioStore((s) => s.updateAnimations),
});

export const useSeoStore = () => ({
  seo: usePortfolioStore((s) => s.data.seo),
  updateSeo: usePortfolioStore((s) => s.updateSeo),
});

export const useSocialsStore = () => ({
  socials: usePortfolioStore((s) => s.data.socials),
  setSocials: usePortfolioStore((s) => s.setSocials),
});

export const useSectionStore = () => ({
  sections: usePortfolioStore((s) => s.data.sections),
  order: usePortfolioStore((s) => s.data.sections.order),
  visibility: usePortfolioStore((s) => s.data.sections.visibility),
  updateSection: usePortfolioStore((s) => s.updateSection),
  setSectionOrder: usePortfolioStore((s) => s.setSectionOrder),
  toggleSectionVisibility: usePortfolioStore((s) => s.toggleSectionVisibility),
});

/** Read a single section's content/config, typed by key. */
export function useSection<K extends SectionKey>(key: K): SectionsConfig[K] {
  return usePortfolioStore((s) => s.data.sections[key]) as SectionsConfig[K];
}
