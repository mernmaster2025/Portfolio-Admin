"use client";

import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { SectionShell } from "./SectionShell";
import { Reveal } from "@/components/preview/Reveal";

function Stats() {
  const stats = usePortfolioStore((s) => s.data.sections.about.stats);
  if (!stats.length) return null;
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr 1fr", sm: `repeat(${Math.min(stats.length, 4)}, 1fr)` },
        gap: 2,
      }}
    >
      {stats.map((s) => (
        <Card key={s.id} variant="outlined" sx={{ textAlign: "center" }}>
          <CardContent>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>
              {s.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {s.label}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export function About() {
  const about = usePortfolioStore((s) => s.data.sections.about);

  return (
    <SectionShell id="about" heading={about.heading} eyebrow="Who I am" alt>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: { xs: 4, md: 6 },
          alignItems: "start",
        }}
      >
        <Reveal>
          <Stack spacing={2}>
            <Typography color="text.secondary" sx={{ fontSize: "1.05rem", lineHeight: 1.8 }}>
              {about.description}
            </Typography>
            {about.highlights.length > 0 &&
              (about.variant === "timeline" ? (
                <Stack spacing={1.5} sx={{ borderLeft: 2, borderColor: "divider", pl: 2, mt: 1 }}>
                  {about.highlights.map((h, i) => (
                    <Typography key={i} sx={{ position: "relative" }}>
                      <Box
                        sx={{
                          position: "absolute",
                          left: -25,
                          top: 6,
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                        }}
                      />
                      {h}
                    </Typography>
                  ))}
                </Stack>
              ) : about.variant === "cards" ? (
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mt: 1 }}>
                  {about.highlights.map((h, i) => (
                    <Card key={i} variant="outlined">
                      <CardContent sx={{ py: 1.5 }}>
                        <Typography variant="body2">{h}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Stack spacing={1} sx={{ mt: 1 }}>
                  {about.highlights.map((h, i) => (
                    <Stack key={i} direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <CheckCircleIcon color="primary" fontSize="small" />
                      <Typography>{h}</Typography>
                    </Stack>
                  ))}
                </Stack>
              ))}
          </Stack>
        </Reveal>
        {about.showStats && (
          <Reveal delay={0.1}>
            <Stats />
          </Reveal>
        )}
      </Box>
    </SectionShell>
  );
}
