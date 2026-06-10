"use client";

import { useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { buildPortfolioTheme, resolveMode } from "@/theme/buildTheme";
import { PortfolioHeader } from "@/sections/PortfolioHeader";
import { PortfolioFooter } from "@/sections/PortfolioFooter";
import { SECTION_COMPONENTS } from "@/sections";
import type { SectionKey } from "@/schemas/portfolio";

/** Which sections render on the alternate (paper) background. */
const SECTION_BG: Record<SectionKey, "default" | "paper"> = {
  hero: "default",
  about: "paper",
  skills: "default",
  experience: "paper",
  projects: "default",
  testimonials: "default",
  contact: "paper",
};

/**
 * Renders the live portfolio from the store inside its own (nested) MUI theme,
 * isolated from the admin chrome. The whole composition is schema-driven:
 * section order and visibility come straight from the store.
 */
export function PortfolioRenderer({
  forcedColorMode,
}: {
  forcedColorMode?: "light" | "dark";
}) {
  const theme = usePortfolioStore((s) => s.data.theme);
  const order = usePortfolioStore((s) => s.data.sections.order);
  const visibility = usePortfolioStore((s) => s.data.sections.visibility);

  // The visitor's in-portfolio theme switch overrides the resolved base mode,
  // but only until the base itself changes (e.g. the builder's preview toolbar
  // or theme.mode updates), at which point the new base wins again. Tracking the
  // override against the base it was set for avoids a setState-in-effect sync.
  const base = forcedColorMode ?? resolveMode(theme.mode);
  const [override, setOverride] = useState<{ base: string; value: "light" | "dark" } | null>(null);
  const mode = override && override.base === base ? override.value : base;
  const toggleColorMode = () =>
    setOverride({ base, value: mode === "dark" ? "light" : "dark" });

  const muiTheme = useMemo(() => buildPortfolioTheme(theme, mode), [theme, mode]);

  const visible = order.filter((k) => visibility[k]);
  // Match the page background to the first visible section so the header (and
  // the gap around a floating header) blends seamlessly into it.
  const pageBg = visible[0] && SECTION_BG[visible[0]] === "paper" ? "background.paper" : "background.default";

  return (
    <ThemeProvider theme={muiTheme}>
      <Box
        sx={{
          bgcolor: pageBg,
          color: "text.primary",
          minHeight: "100vh",
          fontFamily: muiTheme.typography.fontFamily,
          // Flex column establishes a BFC so a floating header's top margin
          // doesn't collapse through and expose the document background.
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PortfolioHeader colorMode={mode} onToggleColorMode={toggleColorMode} />
        {visible.map((key) => {
          const Component = SECTION_COMPONENTS[key];
          return <Component key={key} />;
        })}
        <PortfolioFooter />
      </Box>
    </ThemeProvider>
  );
}
