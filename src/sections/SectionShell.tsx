"use client";

import { Box, Container, Typography } from "@mui/material";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { Reveal } from "@/components/preview/Reveal";

/** Shared section container: consistent padding, max width, and heading. */
export function SectionShell({
  id,
  heading,
  eyebrow,
  children,
  alt = false,
}: {
  id: string;
  heading?: string;
  eyebrow?: string;
  children: React.ReactNode;
  alt?: boolean;
}) {
  const containerWidth = usePortfolioStore((s) => s.data.theme.containerWidth);

  return (
    <Box
      component="section"
      id={id}
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: alt ? "background.paper" : "background.default",
        scrollMarginTop: "80px",
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: containerWidth }}>
        {heading && (
          <Reveal>
            <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: "center" }}>
              {eyebrow && (
                <Typography
                  variant="overline"
                  color="primary"
                  sx={{ fontWeight: 700, letterSpacing: 2 }}
                >
                  {eyebrow}
                </Typography>
              )}
              <Typography variant="h3" sx={{ fontWeight: 800 }}>
                {heading}
              </Typography>
              <Box
                sx={{
                  width: 56,
                  height: 4,
                  borderRadius: 2,
                  mx: "auto",
                  mt: 1.5,
                  background: (t) =>
                    `linear-gradient(90deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
                }}
              />
            </Box>
          </Reveal>
        )}
        {children}
      </Container>
    </Box>
  );
}
