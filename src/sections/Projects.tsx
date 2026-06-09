"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { SectionShell } from "./SectionShell";
import { Reveal } from "@/components/preview/Reveal";
import type { projectItemSchema } from "@/schemas/portfolio";
import type { z } from "zod";

type Project = z.infer<typeof projectItemSchema>;

function Thumb({ project }: { project: Project }) {
  return (
    <Box
      sx={{
        height: 170,
        borderRadius: 2,
        mb: 1.5,
        position: "relative",
        overflow: "hidden",
        backgroundImage: project.image
          ? `url(${project.image})`
          : (t) => `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "grid",
        placeItems: "center",
      }}
    >
      {!project.image && (
        <Typography variant="h4" sx={{ fontWeight: 800, color: "rgba(255,255,255,0.9)" }}>
          {project.title.slice(0, 2).toUpperCase()}
        </Typography>
      )}
      {project.featured && (
        <Chip
          label="Featured"
          size="small"
          color="secondary"
          sx={{ position: "absolute", top: 8, right: 8 }}
        />
      )}
    </Box>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const cfg = usePortfolioStore((s) => s.data.sections.projects);
  return (
    <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Thumb project={project} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {project.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, flex: 1 }}>
          {project.description}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, my: 1.5 }}>
          {project.technologies.map((t) => (
            <Chip key={t} label={t} size="small" variant="outlined" />
          ))}
        </Box>
        <Stack direction="row" spacing={1}>
          {cfg.showGithub && project.githubUrl && (
            <Button size="small" startIcon={<GitHubIcon />} href={project.githubUrl} target="_blank">
              Code
            </Button>
          )}
          {cfg.showDemo && project.liveUrl && (
            <Button
              size="small"
              variant="contained"
              startIcon={<LaunchIcon />}
              href={project.liveUrl}
              target="_blank"
            >
              Live
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export function Projects() {
  const cfg = usePortfolioStore((s) => s.data.sections.projects);
  const { variant, items, columns, showFilters, heading } = cfg;
  const [filter, setFilter] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((p) => p.category).filter(Boolean)))],
    [items]
  );
  const visible = filter === "All" ? items : items.filter((p) => p.category === filter);

  const cols = Math.min(Math.max(columns, 1), 4);

  return (
    <SectionShell id="projects" heading={heading} eyebrow="Selected work">
      {showFilters && categories.length > 1 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center", mb: 4 }}>
          {categories.map((c) => (
            <Chip
              key={c}
              label={c}
              onClick={() => setFilter(c)}
              color={filter === c ? "primary" : "default"}
              variant={filter === c ? "filled" : "outlined"}
            />
          ))}
        </Box>
      )}

      {variant === "masonry" ? (
        <Box sx={{ columnCount: { xs: 1, sm: 2, md: cols }, columnGap: 24 }}>
          {visible.map((p, i) => (
            <Box key={p.id} sx={{ breakInside: "avoid", mb: 3 }}>
              <Reveal delay={i * 0.04}>
                <ProjectCard project={p} />
              </Reveal>
            </Box>
          ))}
        </Box>
      ) : variant === "carousel" ? (
        <Box
          sx={{
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: { xs: "85%", sm: "45%", md: `${100 / cols}%` },
            gap: 3,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            pb: 2,
            "& > *": { scrollSnapAlign: "start" },
          }}
        >
          {visible.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.04}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: `repeat(${cols}, 1fr)` },
            gap: 3,
          }}
        >
          {visible.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.04}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </Box>
      )}
    </SectionShell>
  );
}
