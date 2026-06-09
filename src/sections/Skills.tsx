"use client";

import { Box, Card, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { SectionShell } from "./SectionShell";
import { Reveal } from "@/components/preview/Reveal";
import type { skillSchema } from "@/schemas/portfolio";
import type { z } from "zod";

type Skill = z.infer<typeof skillSchema>;

function groupByCategory(items: Skill[]) {
  const map = new Map<string, Skill[]>();
  for (const item of items) {
    const list = map.get(item.category) ?? [];
    list.push(item);
    map.set(item.category, list);
  }
  return [...map.entries()];
}

export function Skills() {
  const skills = usePortfolioStore((s) => s.data.sections.skills);
  const { variant, items, heading } = skills;

  return (
    <SectionShell id="skills" heading={heading} eyebrow="What I use">
      {variant === "progress" && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            columnGap: 5,
            rowGap: 3,
            maxWidth: 900,
            mx: "auto",
          }}
        >
          {items.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.04}>
              <Box>
                <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
                  <Typography sx={{ fontWeight: 600 }}>{s.name}</Typography>
                  <Typography color="text.secondary">{s.percentage}%</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={s.percentage}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Reveal>
          ))}
        </Box>
      )}

      {variant === "cards" && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3,1fr)", md: "repeat(4,1fr)" },
            gap: 2,
          }}
        >
          {items.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.04}>
              <Card variant="outlined" sx={{ textAlign: "center", height: "100%" }}>
                <CardContent>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 800 }}>
                    {s.percentage}%
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>{s.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {s.category}
                  </Typography>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </Box>
      )}

      {variant === "tags" && (
        <Stack spacing={3} sx={{ maxWidth: 900, mx: "auto" }}>
          {groupByCategory(items).map(([category, list]) => (
            <Reveal key={category}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {category}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {list.map((s) => (
                    <Chip key={s.id} label={s.name} color="primary" variant="outlined" />
                  ))}
                </Box>
              </Box>
            </Reveal>
          ))}
        </Stack>
      )}

      {variant === "timeline" && (
        <Stack spacing={2} sx={{ maxWidth: 720, mx: "auto", borderLeft: 2, borderColor: "divider", pl: 3 }}>
          {items.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.04}>
              <Box sx={{ position: "relative" }}>
                <Box
                  sx={{
                    position: "absolute",
                    left: -31,
                    top: 4,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                  }}
                />
                <Typography sx={{ fontWeight: 600 }}>
                  {s.name} · <Typography component="span" color="text.secondary">{s.category}</Typography>
                </Typography>
                <LinearProgress variant="determinate" value={s.percentage} sx={{ height: 6, borderRadius: 3, mt: 0.5 }} />
              </Box>
            </Reveal>
          ))}
        </Stack>
      )}
    </SectionShell>
  );
}
