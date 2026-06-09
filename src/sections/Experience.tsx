"use client";

import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { SectionShell } from "./SectionShell";
import { Reveal } from "@/components/preview/Reveal";
import type { experienceItemSchema } from "@/schemas/portfolio";
import type { z } from "zod";

type Item = z.infer<typeof experienceItemSchema>;

function dateRange(item: Item) {
  const end = item.current ? "Present" : item.endDate || "—";
  return [item.startDate, end].filter(Boolean).join(" — ");
}

function Techs({ techs }: { techs: string[] }) {
  if (!techs.length) return null;
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1 }}>
      {techs.map((t) => (
        <Chip key={t} label={t} size="small" variant="outlined" />
      ))}
    </Box>
  );
}

function Body({ item }: { item: Item }) {
  return (
    <>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {item.position}
        </Typography>
        <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
          {dateRange(item)}
        </Typography>
      </Stack>
      <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
        {item.company}
        {item.location ? ` · ${item.location}` : ""}
      </Typography>
      {item.description && (
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {item.description}
        </Typography>
      )}
      <Techs techs={item.technologies} />
    </>
  );
}

export function Experience() {
  const exp = usePortfolioStore((s) => s.data.sections.experience);
  const { variant, items, heading } = exp;

  if (variant === "cards" || variant === "modern") {
    return (
      <SectionShell id="experience" heading={heading} eyebrow="Where I've worked" alt>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Body item={item} />
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </Box>
      </SectionShell>
    );
  }

  if (variant === "list") {
    return (
      <SectionShell id="experience" heading={heading} eyebrow="Where I've worked" alt>
        <Stack divider={<Box sx={{ borderTop: 1, borderColor: "divider" }} />} spacing={3} sx={{ maxWidth: 860, mx: "auto" }}>
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <Box sx={{ pt: i === 0 ? 0 : 3 }}>
                <Body item={item} />
              </Box>
            </Reveal>
          ))}
        </Stack>
      </SectionShell>
    );
  }

  // timeline (default)
  return (
    <SectionShell id="experience" heading={heading} eyebrow="Where I've worked" alt>
      <Box sx={{ maxWidth: 820, mx: "auto", borderLeft: 2, borderColor: "divider", pl: { xs: 3, md: 4 } }}>
        <Stack spacing={4}>
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <Box sx={{ position: "relative" }}>
                <Box
                  sx={{
                    position: "absolute",
                    left: { xs: -35, md: -43 },
                    top: 2,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    color: "#fff",
                    background: (t) => `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
                  }}
                >
                  <WorkIcon sx={{ fontSize: 16 }} />
                </Box>
                <Body item={item} />
              </Box>
            </Reveal>
          ))}
        </Stack>
      </Box>
    </SectionShell>
  );
}
