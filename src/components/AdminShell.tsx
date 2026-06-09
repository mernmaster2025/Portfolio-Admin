"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Box, Toolbar } from "@mui/material";
import Sidebar, { SIDEBAR_WIDTH } from "./Sidebar";
import Topbar from "./Topbar";
import { NAV, SECTION_LABELS } from "@/lib/nav";
import type { SectionKey } from "@/schemas/portfolio";

function titleFor(pathname: string): string {
  const sectionMatch = pathname.match(/^\/admin\/sections\/([a-z]+)/);
  if (sectionMatch) {
    const key = sectionMatch[1] as SectionKey;
    return `${SECTION_LABELS[key] ?? "Section"} Builder`;
  }
  const exact = NAV.find((n) => n.href === pathname);
  if (exact) return exact.label;
  return "Dashboard";
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const title = titleFor(pathname);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Topbar title={title} onMenuClick={() => setMobileOpen((o) => !o)} />
        <Toolbar />
        <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
