"use client";

import { Avatar, Box, Card, CardContent, Stack, Typography } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { SectionShell } from "./SectionShell";
import { Reveal } from "@/components/preview/Reveal";
import type { testimonialItemSchema } from "@/schemas/portfolio";
import type { z } from "zod";

type Item = z.infer<typeof testimonialItemSchema>;

function Quote({ item }: { item: Item }) {
  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <FormatQuoteIcon color="primary" sx={{ fontSize: 36, opacity: 0.5 }} />
        <Typography sx={{ fontStyle: "italic", mb: 2 }}>{item.quote}</Typography>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Avatar src={item.avatar || undefined}>{item.name[0]}</Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700 }}>{item.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {[item.position, item.company].filter(Boolean).join(", ")}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function Testimonials() {
  const t = usePortfolioStore((s) => s.data.sections.testimonials);
  const { variant, items, heading } = t;

  if (variant === "carousel") {
    return (
      <SectionShell id="testimonials" heading={heading} eyebrow="Kind words">
        <Box
          sx={{
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: { xs: "85%", md: "40%" },
            gap: 3,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            pb: 2,
            "& > *": { scrollSnapAlign: "center" },
          }}
        >
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.04}>
              <Quote item={item} />
            </Reveal>
          ))}
        </Box>
      </SectionShell>
    );
  }

  const cols = variant === "grid" ? 3 : 2;
  return (
    <SectionShell id="testimonials" heading={heading} eyebrow="Kind words">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: `repeat(${cols}, 1fr)` },
          gap: 3,
        }}
      >
        {items.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.04}>
            <Quote item={item} />
          </Reveal>
        ))}
      </Box>
    </SectionShell>
  );
}
