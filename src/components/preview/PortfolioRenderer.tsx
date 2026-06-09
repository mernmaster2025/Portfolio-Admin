"use client";

import { useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { buildPortfolioTheme, resolveMode } from "@/theme/buildTheme";
import { PortfolioHeader } from "@/sections/PortfolioHeader";
import { PortfolioFooter } from "@/sections/PortfolioFooter";
import { SECTION_COMPONENTS } from "@/sections";

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

  return (
    <ThemeProvider theme={muiTheme}>
      <Box
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          minHeight: "100vh",
          fontFamily: muiTheme.typography.fontFamily,
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
