"use client";

import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DownloadIcon from "@mui/icons-material/Download";
import { motion } from "framer-motion";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { SECTION_LABELS } from "@/lib/nav";
import { SocialIcon, socialHref } from "@/lib/socialIcons";
import type { SectionKey } from "@/schemas/portfolio";

const HEADER_ANIM = {
  none: undefined,
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
  "slide-down": { initial: { y: -40, opacity: 0 }, animate: { y: 0, opacity: 1 } },
  blur: { initial: { filter: "blur(8px)", opacity: 0 }, animate: { filter: "blur(0px)", opacity: 1 } },
  scale: { initial: { scale: 0.96, opacity: 0 }, animate: { scale: 1, opacity: 1 } },
} as const;

export function PortfolioHeader({
  colorMode,
  onToggleColorMode,
}: {
  colorMode: "light" | "dark";
  onToggleColorMode: () => void;
}) {
  const header = usePortfolioStore((s) => s.data.header);
  const theme = usePortfolioStore((s) => s.data.theme);
  const sections = usePortfolioStore((s) => s.data.sections);
  const socials = usePortfolioStore((s) => s.data.socials);
  const heroResume = usePortfolioStore((s) => s.data.sections.hero.resumeUrl);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = sections.order.filter((k) => sections.visibility[k]);
  const label = (k: SectionKey) => (k === "hero" ? "Home" : SECTION_LABELS[k]);

  const positionSx =
    header.position === "static"
      ? { position: "static" as const }
      : header.position === "floating"
      ? {
          position: "sticky" as const,
          top: 12,
          mx: "auto",
          mt: 1.5,
          maxWidth: theme.containerWidth - 40,
          borderRadius: 3,
          boxShadow: 6,
          width: "calc(100% - 24px)",
        }
      : { position: "sticky" as const, top: 0 };

  const anim = HEADER_ANIM[header.animation];
  const centered = header.variant === "centered";

  const Logo = header.showLogo ? (
    <Typography
      component="a"
      href="#hero"
      variant="h6"
      sx={{
        fontWeight: 800,
        background: (t) => `linear-gradient(90deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {header.logoText}
    </Typography>
  ) : (
    <span />
  );

  const NavLinks = header.showNavigation ? (
    <Stack direction="row" spacing={0.5} sx={{ display: { xs: "none", md: "flex" } }}>
      {navItems.map((k) => (
        <Button key={k} href={`#${k}`} color="inherit" sx={{ fontWeight: 600 }}>
          {label(k)}
        </Button>
      ))}
    </Stack>
  ) : null;

  const Actions = (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
      {header.showSocialIcons &&
        socials.slice(0, 4).map((s) => (
          <IconButton key={s.id} component="a" href={socialHref(s)} target="_blank" rel="noreferrer" size="small" color="inherit" aria-label={s.platform}>
            <SocialIcon platform={s.platform} />
          </IconButton>
        ))}
      {header.showThemeSwitcher && theme.themeSwitcher && (
        <IconButton onClick={onToggleColorMode} color="inherit" aria-label="Toggle color mode">
          {colorMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      )}
      {header.showResumeButton && (
        <Button
          variant="contained"
          size="small"
          startIcon={<DownloadIcon />}
          href={heroResume || "#contact"}
          target={heroResume ? "_blank" : undefined}
          sx={{ display: { xs: "none", sm: "inline-flex" }, ml: 0.5 }}
        >
          Resume
        </Button>
      )}
      {header.showNavigation && (
        <IconButton onClick={() => setDrawerOpen(true)} color="inherit" sx={{ display: { md: "none" } }} aria-label="Open menu">
          <MenuIcon />
        </IconButton>
      )}
    </Stack>
  );

  const bar = (
    <AppBar
      position="static"
      color="default"
      elevation={header.position === "static" ? 0 : 2}
      sx={{
        ...positionSx,
        backdropFilter: "blur(10px)",
        backgroundColor: (t) =>
          t.palette.mode === "dark" ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.7)",
        borderBottom: header.variant === "minimal" ? 1 : 0,
        borderColor: "divider",
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: theme.containerWidth }}>
        {centered ? (
          <Stack spacing={0.5} sx={{ alignItems: "center", py: 1 }}>
            {Logo}
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              {NavLinks}
              {Actions}
            </Stack>
          </Stack>
        ) : (
          <Toolbar disableGutters sx={{ gap: 1 }}>
            {Logo}
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
              {header.variant !== "minimal" && NavLinks}
            </Box>
            {Actions}
          </Toolbar>
        )}
      </Container>
    </AppBar>
  );

  return (
    <>
      {anim ? (
        <motion.div initial={anim.initial} animate={anim.animate} transition={{ duration: 0.5 }}>
          {bar}
        </motion.div>
      ) : (
        bar
      )}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            {navItems.map((k) => (
              <ListItemButton key={k} component="a" href={`#${k}`}>
                <ListItemText primary={label(k)} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
