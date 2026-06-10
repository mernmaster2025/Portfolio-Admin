"use client";

import Link from "next/link";
import { Box, Button, Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import ViewDayIcon from "@mui/icons-material/ViewDay";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { useHydrated } from "@/stores/domains";

const LINKS = [
  { href: "/admin/theme", label: "Theme", desc: "Colors, fonts & presets", icon: PaletteIcon },
  { href: "/admin/header", label: "Header", desc: "Style, position & links", icon: ViewDayIcon },
  { href: "/admin/sections", label: "Sections", desc: "Reorder & edit content", icon: DashboardIcon },
  { href: "/admin/animations", label: "Animations", desc: "Motion & effects", icon: AutoAwesomeIcon },
  { href: "/admin/seo", label: "SEO", desc: "Meta & social sharing", icon: SearchIcon },
  { href: "/admin/preview", label: "Preview", desc: "Responsive preview", icon: VisibilityIcon },
];

export default function DashboardHome() {
  const hydrated = useHydrated();
  const data = usePortfolioStore((s) => s.data);

  const visibleCount = data.sections.order.filter((k) => data.sections.visibility[k]).length;
  const stats = [
    { label: "Visible sections", value: hydrated ? `${visibleCount}/7` : "—" },
    { label: "Projects", value: hydrated ? data.sections.projects.items.length : "—" },
    { label: "Skills", value: hydrated ? data.sections.skills.items.length : "—" },
    { label: "Theme preset", value: hydrated ? data.theme.preset : "—" },
  ];

  return (
    <Box sx={{ height: "100%", overflowY: "auto", p: { xs: 2, md: 4 } }}>
    <Box sx={{ maxWidth: 1100, mx: "auto", width: "100%" }}>
      <Card
        sx={{
          mb: 3,
          color: "#fff",
          background: "linear-gradient(135deg,#6366f1,#ec4899)",
          border: 0,
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Welcome to Portfolio Builder
          </Typography>
          <Typography sx={{ opacity: 0.9, mt: 1, maxWidth: 620 }}>
            Visually craft your portfolio with a live preview. Everything renders from a single
            schema — customize it here, then export a standalone Next.js project.
          </Typography>
          <Stack direction="row" spacing={1.5} sx={{ mt: 3, flexWrap: "wrap" }}>
            <Button component={Link} href="/admin/theme" variant="contained" color="inherit" sx={{ color: "#111" }}>
              Start customizing
            </Button>
            <Button component={Link} href="/admin/export" variant="outlined" color="inherit" startIcon={<DownloadIcon />}>
              Export project
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" }, gap: 2, mb: 3 }}>
        {stats.map((s) => (
          <Card key={s.label} variant="outlined">
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 800, textTransform: "capitalize" }}>
                {s.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {s.label}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
        Builder modules
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3,1fr)" }, gap: 2 }}>
        {LINKS.map((l) => {
          const Icon = l.icon;
          return (
            <Card key={l.href} variant="outlined">
              <CardActionArea component={Link} href={l.href} sx={{ p: 1 }}>
                <CardContent>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    <Box sx={{ color: "primary.main" }}>
                      <Icon />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{l.label}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {l.desc}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Box>
    </Box>
    </Box>
  );
}
