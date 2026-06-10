"use client";

import { Box } from "@mui/material";
import LivePreview from "@/components/preview/LivePreview";

/**
 * Two-panel builder layout: live preview on the left, editor controls on the
 * right (desktop). `row-reverse` keeps the editor first in the DOM (so it stacks
 * on top on mobile) while rendering it on the right on desktop. Each pane scrolls
 * independently — the preview is its own iframe document.
 */
export default function EditorShell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row-reverse" }, flex: 1, minHeight: 0 }}>
      <Box
        sx={{
          width: { xs: "100%", md: 460 },
          flexShrink: 0,
          overflowY: "auto",
          p: { xs: 2, md: 3 },
          borderLeft: { md: 1 },
          borderColor: "divider",
        }}
      >
        {children}
      </Box>
      <Box sx={{ flex: 1, minHeight: { xs: 520, md: 0 }, minWidth: 0 }}>
        <LivePreview />
      </Box>
    </Box>
  );
}
