"use client";

import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { useUiStore } from "@/stores/uiStore";
import { useHydrated } from "@/stores/domains";
import { PortfolioRenderer } from "./PortfolioRenderer";

/**
 * The standalone preview document loaded inside the builder's iframe.
 *
 * It shares localStorage with the parent (same origin), so it rehydrates the
 * Zustand stores whenever the parent writes a change — giving real-time updates
 * while letting MUI breakpoints respond to the iframe's actual width.
 */
export default function PreviewFrame() {
  const hydrated = useHydrated();
  const previewColorMode = useUiStore((s) => s.previewColorMode);

  useEffect(() => {
    const sync = () => {
      void usePortfolioStore.persist.rehydrate();
      void useUiStore.persist.rehydrate();
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  if (!hydrated) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  const forced = previewColorMode === "auto" ? undefined : previewColorMode;
  return <PortfolioRenderer forcedColorMode={forced} />;
}
