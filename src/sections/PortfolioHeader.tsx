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
import type { SxProps, Theme } from "@mui/material/styles";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { SECTION_LABELS } from "@/lib/nav";
import { SocialIcon, socialHref } from "@/lib/socialIcons";
import { useHideOnScroll } from "@/lib/useScrollHeader";
import type { HeaderConfig, SectionKey } from "@/schemas/portfolio";

/** Entrance animation applied once on mount via CSS (so it never breaks sticky). */
const ENTRANCE: Record<HeaderConfig["animation"], object> = {
  none: {},
  fade: {
    animation: "hdrFade .5s ease",
    "@keyframes hdrFade": { from: { opacity: 0 }, to: { opacity: 1 } },
  },
  "slide-down": {
    animation: "hdrSlide .5s ease",
    "@keyframes hdrSlide": {
      from: { transform: "translateY(-40px)", opacity: 0 },
      to: { transform: "translateY(0)", opacity: 1 },
    },
  },
  blur: {
    animation: "hdrBlur .5s ease",
    "@keyframes hdrBlur": {
      from: { filter: "blur(8px)", opacity: 0 },
      to: { filter: "blur(0)", opacity: 1 },
    },
  },
  scale: {
    animation: "hdrScale .5s ease",
    "@keyframes hdrScale": {
      from: { transform: "scale(.96)", opacity: 0 },
      to: { transform: "scale(1)", opacity: 1 },
    },
  },
};

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
  const scrolledHidden = useHideOnScroll();

  const navItems = sections.order.filter((k) => sections.visibility[k]);
  const label = (k: SectionKey) => (k === "hero" ? "Home" : SECTION_LABELS[k]);

  // Position behaviour.
  const pinned = header.position !== "static"; // sticky or fixed stay on screen
  const muiPosition = pinned ? "sticky" : "static";
  // Only "sticky" hides on scroll-down / reveals on scroll-up. "fixed" never hides.
  const hidden = header.position === "sticky" && scrolledHidden;

  // Variant layouts:
  //  classic  — logo left, nav grouped on the right
  //  modern   — logo left, nav centered, actions right
  //  centered — logo stacked on top, nav + actions below (all centered)
  //  sidebar  — no inline nav; a menu button (left) opens a side drawer
  //  minimal  — clean bar, no inline nav; menu button reveals the drawer
  const centered = header.variant === "centered";
  const sidebarMode = header.variant === "sidebar";
  const minimalMode = header.variant === "minimal";
  const navCenter = header.variant === "modern";
  const navRight = header.variant === "classic";
  const drawerAnchor = sidebarMode ? "left" : "right";
  const isImageLogo = header.logoType === "image" && !!header.logoImage;

  // Hover / active style for nav links.
  const navItemSx: SxProps<Theme> =
    header.navStyle === "pill"
      ? { fontWeight: 600, borderRadius: 999, px: 1.75, "&:hover": { bgcolor: "action.hover" } }
      : header.navStyle === "underline"
      ? {
          fontWeight: 600,
          borderRadius: 0,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            left: 8,
            right: 8,
            bottom: 6,
            height: 2,
            bgcolor: "primary.main",
            transform: "scaleX(0)",
            transformOrigin: "left",
            transition: "transform .2s ease",
          },
          "&:hover::after": { transform: "scaleX(1)" },
        }
      : { fontWeight: 600, "&:hover": { color: "primary.main" } };

  // Floating shape: a rounded, inset bar — independent of position.
  const floatingSx = header.floating
    ? {
        mx: "auto",
        mt: 1.5,
        width: "calc(100% - 24px)",
        maxWidth: theme.containerWidth - 24,
        borderRadius: 3,
        boxShadow: 6,
        overflow: "hidden",
      }
    : {};

  const Logo = !header.showLogo ? (
    <span />
  ) : isImageLogo ? (
    <Box component="a" href="#hero" sx={{ display: "inline-flex", alignItems: "center" }}>
      <Box
        component="img"
        src={header.logoImage}
        alt={header.logoText || "Logo"}
        sx={{ height: header.logoHeight, width: "auto", display: "block" }}
      />
    </Box>
  ) : (
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
  );

  const NavLinks = header.showNavigation ? (
    <Stack direction="row" spacing={0.5} sx={{ display: { xs: "none", md: "flex" } }}>
      {navItems.map((k) => (
        <Button key={k} href={`#${k}`} color="inherit" sx={navItemSx}>
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
    </Stack>
  );

  // The drawer trigger. Sidebar & minimal show it at all sizes (no inline nav);
  // classic/modern/centered show it only on mobile (where inline nav collapses).
  const MenuButton = header.showNavigation ? (
    <IconButton
      onClick={() => setDrawerOpen(true)}
      color="inherit"
      aria-label="Open menu"
      sx={{ display: sidebarMode || minimalMode ? "inline-flex" : { md: "none" } }}
    >
      <MenuIcon />
    </IconButton>
  ) : null;

  return (
    <>
      <AppBar
        position={muiPosition}
        color="default"
        elevation={header.background === "transparent" ? 0 : pinned ? 2 : 0}
        sx={{
          top: 0,
          // Hide (sticky only) by sliding up; smooth transition.
          transform: hidden ? "translateY(-130%)" : "none",
          transition: "transform .35s ease",
          backdropFilter: header.background === "blur" ? "blur(10px)" : "none",
          backgroundColor: (t) =>
            header.background === "transparent"
              ? "transparent"
              : header.background === "solid"
              ? header.backgroundColor
              : header.background === "gradient"
              ? "transparent"
              : t.palette.mode === "dark"
              ? "rgba(0,0,0,0.45)"
              : "rgba(255,255,255,0.7)",
          backgroundImage:
            header.background === "gradient"
              ? `linear-gradient(${header.gradientAngle}deg, ${header.gradientFrom}, ${header.gradientTo})`
              : "none",
          borderBottom: header.showBorder && !header.floating ? 1 : 0,
          borderColor: "divider",
          ...ENTRANCE[header.animation],
          ...floatingSx,
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: theme.containerWidth }}>
          {centered ? (
            <Stack
              spacing={0.5}
              sx={{ alignItems: "center", justifyContent: "center", py: 1, minHeight: header.height }}
            >
              {Logo}
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                {NavLinks}
                {Actions}
                {MenuButton}
              </Stack>
            </Stack>
          ) : (
            <Toolbar disableGutters sx={{ gap: 1, minHeight: header.height }}>
              {sidebarMode && MenuButton}
              {Logo}
              {navCenter ? (
                <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>{NavLinks}</Box>
              ) : (
                <Box sx={{ flex: 1 }} />
              )}
              {navRight && NavLinks}
              {Actions}
              {!sidebarMode && MenuButton}
            </Toolbar>
          )}
        </Container>
      </AppBar>

      <Drawer anchor={drawerAnchor} open={drawerOpen} onClose={() => setDrawerOpen(false)}>
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
