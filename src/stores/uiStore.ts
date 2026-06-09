"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PreviewDevice = "desktop" | "tablet" | "mobile";
/** "auto" follows the portfolio's own theme.mode; light/dark force the preview. */
export type PreviewColorMode = "auto" | "light" | "dark";

interface UiState {
  /** Admin dashboard chrome color mode. */
  adminMode: "light" | "dark";
  toggleAdminMode: () => void;

  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;

  previewDevice: PreviewDevice;
  setPreviewDevice: (d: PreviewDevice) => void;

  previewColorMode: PreviewColorMode;
  setPreviewColorMode: (m: PreviewColorMode) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      adminMode: "dark",
      toggleAdminMode: () =>
        set((s) => ({ adminMode: s.adminMode === "dark" ? "light" : "dark" })),

      sidebarOpen: true,
      setSidebarOpen: (v) => set({ sidebarOpen: v }),

      previewDevice: "desktop",
      setPreviewDevice: (d) => set({ previewDevice: d }),

      previewColorMode: "auto",
      setPreviewColorMode: (m) => set({ previewColorMode: m }),
    }),
    { name: "portfolio-builder:ui" }
  )
);
