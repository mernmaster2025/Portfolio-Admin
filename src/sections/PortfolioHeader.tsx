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

/** Pick a readable text color (black/white) for a solid header background. */
function readableOn(hex: string): string {
  const h = hex.replace("#", "");
  const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(f.slice(0, 2), 16) / 255;
  const g = parseInt(f.slice(2, 4), 16) / 255;
  const b = parseInt(f.slice(4, 6), 16) / 255;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.55 ? "#0b0f17" : "#ffffff";
}

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

  // Readable text for solid bars; theme text for glass. Nav accents derive from
  // it so hover/active styles look right on any background and in either theme.
  const barText =
    header.background === "solid"
      ? readableOn(header.backgroundColor)
      : header.background === "gradient"
      ? readableOn(header.gradientFrom)
      : "text.primary";
  const onSolid = barText !== "text.primary";
  const navAccent = onSolid ? barText : "primary.main";
  const navHover = onSolid ? `${barText}22` : "action.hover";

  // Hover / active style for nav links.
  const navItemSx: SxProps<Theme> =
    header.navStyle === "pill"
      ? { fontWeight: 600, borderRadius: 999, px: 1.75, "&:hover": { bgcolor: navHover } }
      : {
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
            bgcolor: navAccent,
            transform: "scaleX(0)",
            transformOrigin: "left",
            transition: "transform .2s ease",
          },
          "&:hover::after": { transform: "scaleX(1)" },
        };

  // Floating shape: a detached bar capped to the page content width, centered,
  // with the horizontal margin reducing that width (and adding the side gap).
  // Non-floating: a full-width bar that the margin simply insets from the edges.
  // Floating: a consistent gap from the top both at rest (mt) and when stuck
  // (top) — matching them keeps the float smooth as you scroll to the top.
  const floatGap = 16;
  const floatingSx = header.floating
    ? {
        top: `${floatGap}px`,
        mt: `${floatGap}px`,
        mx: "auto",
        width: `calc(100% - ${header.marginX * 2}px)`,
        maxWidth: theme.containerWidth - header.marginX * 2,
        borderRadius: 3,
        boxShadow: 6,
        overflow: "hidden",
      }
    : {};
  const insetSx =
    !header.floating && header.marginX > 0
      ? { width: `calc(100% - ${header.marginX * 2}px)`, mx: "auto" }
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
        color="transparent"
        elevation={pinned ? 2 : 0}
        sx={{
          top: 0,
          color: barText,
          // Hide (sticky only) by sliding up; smooth transition.
          transform: hidden ? "translateY(-130%)" : "none",
          transition: "transform .35s ease",
          backdropFilter: header.background === "blur" ? "blur(10px)" : "none",
          backgroundColor: (t) =>
            header.background === "solid"
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
          ...ENTRANCE[header.animation],
          ...insetSx,
          ...floatingSx,
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: theme.containerWidth }}>
          {centered ? (
            <Stack
              spacing={0.5}
              sx={{
                alignItems: "center",
                justifyContent: "center",
                py: 1,
                minHeight: { xs: header.height, sm: header.height },
              }}
            >
              {Logo}
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                {NavLinks}
                {Actions}
                {MenuButton}
              </Stack>
            </Stack>
          ) : (
            <Toolbar disableGutters sx={{ gap: 1, minHeight: { xs: header.height, sm: header.height } }}>
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
