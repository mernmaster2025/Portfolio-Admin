/**
 * Source text for the exported project's prop-driven portfolio renderer.
 *
 * The builder's own sections are coupled to its Zustand store, so the export
 * ships this self-contained, schema-driven renderer instead. It reads the
 * bundled `content/portfolio.json` and renders header + ordered sections +
 * footer with no dependency on the builder platform.
 */
export const PORTFOLIO_TSX = `"use client";

import { useEffect, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  AppBar, Avatar, Box, Button, Card, CardContent, Chip, Container, Drawer,
  IconButton, LinearProgress, List, ListItemButton, ListItemText, Stack, Toolbar, Typography,
} from "@mui/material";
import data from "../content/portfolio.json";

type AnyObj = Record<string, any>;
const d: AnyObj = data as AnyObj;

const FONT_STACKS: Record<string, string> = {
  Inter: '"Inter", system-ui, sans-serif',
  Roboto: '"Roboto", system-ui, sans-serif',
  Poppins: '"Poppins", system-ui, sans-serif',
  Montserrat: '"Montserrat", system-ui, sans-serif',
  "Space Grotesk": '"Space Grotesk", system-ui, sans-serif',
  "JetBrains Mono": '"JetBrains Mono", ui-monospace, monospace',
};

function luminance(hex: string) {
  const h = hex.replace("#", "");
  const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(f.slice(0, 2), 16) / 255;
  const g = parseInt(f.slice(2, 4), 16) / 255;
  const b = parseInt(f.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function buildTheme(theme: AnyObj, mode: "light" | "dark") {
  const storedIsDark = luminance(theme.backgroundColor) < 0.5;
  const c =
    (mode === "dark") === storedIsDark
      ? { bg: theme.backgroundColor, sf: theme.surfaceColor, tx: theme.textColor }
      : mode === "dark"
      ? { bg: "#0b0f17", sf: "#121826", tx: "#e6edf3" }
      : { bg: "#ffffff", sf: "#f4f6fb", tx: "#0f172a" };
  return createTheme({
    palette: {
      mode,
      primary: { main: theme.primaryColor },
      secondary: { main: theme.secondaryColor },
      background: { default: c.bg, paper: c.sf },
      text: { primary: c.tx },
    },
    shape: { borderRadius: theme.borderRadius },
    typography: { fontFamily: FONT_STACKS[theme.fontFamily] || FONT_STACKS.Inter },
  });
}

const SECTION_LABELS: AnyObj = {
  hero: "Home", about: "About", skills: "Skills", experience: "Experience",
  projects: "Projects", testimonials: "Testimonials", contact: "Contact",
};

function Section({ id, heading, alt, children }: AnyObj) {
  return (
    <Box component="section" id={id} sx={{ py: { xs: 6, md: 10 }, bgcolor: alt ? "background.paper" : "background.default", scrollMarginTop: "80px" }}>
      <Container maxWidth={false} sx={{ maxWidth: d.theme.containerWidth }}>
        {heading && (
          <Typography variant="h3" align="center" sx={{ fontWeight: 800, mb: 5 }}>{heading}</Typography>
        )}
        {children}
      </Container>
    </Box>
  );
}

function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY, ticking = false;
    const update = () => {
      const y = window.scrollY;
      const goingDown = y > lastY && y > 80;
      setHidden((prev) => (goingDown ? true : y < lastY ? false : prev));
      lastY = y; ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}

function Header({ mode, toggle }: { mode: "light" | "dark"; toggle: () => void }) {
  const h = d.header, s = d.sections;
  const nav = (s.order as string[]).filter((k) => s.visibility[k]);
  const scrolledHidden = useHideOnScroll();
  const [open, setOpen] = useState(false);
  const pinned = h.position !== "static";
  const hidden = h.position === "sticky" && scrolledHidden;
  const isImageLogo = h.logoType === "image" && !!h.logoImage;
  const centered = h.variant === "centered", sidebarMode = h.variant === "sidebar";
  const minimalMode = h.variant === "minimal", navCenter = h.variant === "modern", navRight = h.variant === "classic";
  const drawerAnchor = sidebarMode ? "left" : "right";
  const floatingSx = h.floating
    ? { mt: 1.5, mx: "auto", width: \`calc(100% - \${h.marginX * 2}px)\`, maxWidth: d.theme.containerWidth - h.marginX * 2, borderRadius: 3, boxShadow: 6, overflow: "hidden" }
    : {};
  const insetSx = !h.floating && h.marginX > 0 ? { width: \`calc(100% - \${h.marginX * 2}px)\`, mx: "auto" } : {};
  const navItemSx: AnyObj =
    h.navStyle === "pill"
      ? { fontWeight: 600, borderRadius: 999, px: 1.75, "&:hover": { bgcolor: "action.hover" } }
      : h.navStyle === "underline"
      ? { fontWeight: 600, borderRadius: 0, position: "relative",
          "&::after": { content: '""', position: "absolute", left: 8, right: 8, bottom: 6, height: 2, bgcolor: "primary.main", transform: "scaleX(0)", transformOrigin: "left", transition: "transform .2s ease" },
          "&:hover::after": { transform: "scaleX(1)" } }
      : { fontWeight: 600, "&:hover": { color: "primary.main" } };
  const label = (k: string) => (k === "hero" ? "Home" : SECTION_LABELS[k]);
  const logo = !h.showLogo ? <span /> : isImageLogo ? (
    <Box component="a" href="#hero" sx={{ display: "inline-flex", alignItems: "center" }}>
      <Box component="img" src={h.logoImage} alt={h.logoText || "Logo"} sx={{ height: h.logoHeight, width: "auto", display: "block" }} />
    </Box>
  ) : (
    <Typography component="a" href="#hero" variant="h6"
      sx={{ fontWeight: 800, background: (t) => \`linear-gradient(90deg, \${t.palette.primary.main}, \${t.palette.secondary.main})\`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
      {h.logoText}
    </Typography>
  );
  const navLinks = h.showNavigation ? (
    <Stack direction="row" spacing={0.5} sx={{ display: { xs: "none", md: "flex" } }}>
      {nav.map((k) => (<Button key={k} href={\`#\${k}\`} color="inherit" sx={navItemSx}>{label(k)}</Button>))}
    </Stack>
  ) : null;
  const actions = (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
      {h.showThemeSwitcher && d.theme.themeSwitcher && (
        <IconButton onClick={toggle} color="inherit" aria-label="Toggle color mode">{mode === "dark" ? "☀" : "☾"}</IconButton>
      )}
      {h.showResumeButton && (
        <Button variant="contained" size="small" href={d.sections.hero.resumeUrl || "#contact"} sx={{ ml: 0.5 }}>Resume</Button>
      )}
    </Stack>
  );
  const menuButton = h.showNavigation ? (
    <IconButton onClick={() => setOpen(true)} color="inherit" aria-label="Open menu"
      sx={{ display: sidebarMode || minimalMode ? "inline-flex" : { md: "none" } }}>☰</IconButton>
  ) : null;
  return (
    <>
      <AppBar position={pinned ? "sticky" : "static"} color="default"
        elevation={h.background === "transparent" ? 0 : pinned ? 2 : 0}
        sx={{ top: 0, transform: hidden ? "translateY(-130%)" : "none",
          transition: "transform .35s ease",
          backdropFilter: h.background === "blur" ? "blur(10px)" : "none",
          backgroundColor: (t) => h.background === "transparent" ? "transparent"
            : h.background === "solid" ? h.backgroundColor
            : h.background === "gradient" ? "transparent"
            : t.palette.mode === "dark" ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.7)",
          backgroundImage: h.background === "gradient" ? \`linear-gradient(\${h.gradientAngle}deg, \${h.gradientFrom}, \${h.gradientTo})\` : "none",
          borderBottom: h.showBorder && !h.floating ? 1 : 0, borderColor: "divider",
          ...insetSx, ...floatingSx }}>
        <Container maxWidth={false} sx={{ maxWidth: d.theme.containerWidth, px: \`\${h.paddingX}px\` }}>
          {centered ? (
            <Stack spacing={0.5} sx={{ alignItems: "center", justifyContent: "center", py: 1, minHeight: { xs: h.height, sm: h.height } }}>
              {logo}
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>{navLinks}{actions}{menuButton}</Stack>
            </Stack>
          ) : (
            <Toolbar disableGutters sx={{ gap: 1, minHeight: { xs: h.height, sm: h.height } }}>
              {sidebarMode && menuButton}
              {logo}
              {navCenter ? (<Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>{navLinks}</Box>) : (<Box sx={{ flex: 1 }} />)}
              {navRight && navLinks}
              {actions}
              {!sidebarMode && menuButton}
            </Toolbar>
          )}
        </Container>
      </AppBar>
      <Drawer anchor={drawerAnchor} open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 260 }} role="presentation" onClick={() => setOpen(false)}>
          <List>
            {nav.map((k) => (
              <ListItemButton key={k} component="a" href={\`#\${k}\`}><ListItemText primary={label(k)} /></ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

function Hero() {
  const h = d.sections.hero;
  const photo = (
    <Avatar src={h.profileImage || undefined} sx={{ width: 280, height: 280, fontSize: 90, fontWeight: 800,
      background: (t) => \`linear-gradient(135deg, \${t.palette.primary.main}, \${t.palette.secondary.main})\` }}>
      {h.name.split(" ").map((p: string) => p[0]).slice(0, 2).join("")}
    </Avatar>
  );
  const text = (
    <Stack spacing={2.5}>
      <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 3 }}>Hello, I'm</Typography>
      <Typography variant="h2" sx={{ fontWeight: 800 }}>{h.name}</Typography>
      <Typography variant="h5" color="text.secondary">{h.title}</Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 560 }}>{h.description}</Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        {h.primaryCtaLabel && <Button variant="contained" size="large" href={h.primaryCtaHref}>{h.primaryCtaLabel}</Button>}
        {h.secondaryCtaLabel && <Button variant="outlined" size="large" href={h.secondaryCtaHref}>{h.secondaryCtaLabel}</Button>}
      </Stack>
    </Stack>
  );
  return (
    <Box component="section" id="hero" sx={{ py: { xs: 8, md: 12 }, display: "flex", alignItems: "center",
      background: (t) => \`radial-gradient(1000px 500px at 80% -10%, \${t.palette.primary.main}22, transparent)\` }}>
      <Container maxWidth={false} sx={{ maxWidth: d.theme.containerWidth }}>
        {h.variant === "split" && h.showPhoto ? (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" }, gap: 6, alignItems: "center" }}>
            {text}<Box sx={{ display: "flex", justifyContent: "center" }}>{photo}</Box>
          </Box>
        ) : (
          <Stack spacing={4} sx={{ alignItems: "center", textAlign: "center" }}>{h.showPhoto && photo}{text}</Stack>
        )}
      </Container>
    </Box>
  );
}

function About() {
  const a = d.sections.about;
  return (
    <Section id="about" heading={a.heading} alt>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 5 }}>
        <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>{a.description}</Typography>
        {a.showStats && (
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {a.stats.map((s: AnyObj) => (
              <Card key={s.id} variant="outlined" sx={{ textAlign: "center" }}><CardContent>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>{s.value}</Typography>
                <Typography variant="body2" color="text.secondary">{s.label}</Typography>
              </CardContent></Card>
            ))}
          </Box>
        )}
      </Box>
    </Section>
  );
}

function Skills() {
  const sk = d.sections.skills;
  return (
    <Section id="skills" heading={sk.heading}>
      {sk.variant === "tags" ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
          {sk.items.map((s: AnyObj) => <Chip key={s.id} label={s.name} color="primary" variant="outlined" />)}
        </Box>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, columnGap: 5, rowGap: 3, maxWidth: 900, mx: "auto" }}>
          {sk.items.map((s: AnyObj) => (
            <Box key={s.id}>
              <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
                <Typography sx={{ fontWeight: 600 }}>{s.name}</Typography>
                <Typography color="text.secondary">{s.percentage}%</Typography>
              </Stack>
              <LinearProgress variant="determinate" value={s.percentage} sx={{ height: 8, borderRadius: 4 }} />
            </Box>
          ))}
        </Box>
      )}
    </Section>
  );
}

function Experience() {
  const e = d.sections.experience;
  return (
    <Section id="experience" heading={e.heading} alt>
      <Box sx={{ maxWidth: 820, mx: "auto", borderLeft: 2, borderColor: "divider", pl: 4 }}>
        <Stack spacing={4}>
          {e.items.map((it: AnyObj) => (
            <Box key={it.id} sx={{ position: "relative" }}>
              <Box sx={{ position: "absolute", left: -49, top: 2, width: 14, height: 14, borderRadius: "50%", bgcolor: "primary.main" }} />
              <Stack direction="row" sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{it.position}</Typography>
                <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>{it.startDate} — {it.current ? "Present" : it.endDate}</Typography>
              </Stack>
              <Typography color="text.secondary" sx={{ fontWeight: 600 }}>{it.company}{it.location ? \` · \${it.location}\` : ""}</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>{it.description}</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1 }}>
                {it.technologies.map((t: string) => <Chip key={t} label={t} size="small" variant="outlined" />)}
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Section>
  );
}

function Projects() {
  const p = d.sections.projects;
  const cols = Math.min(Math.max(p.columns, 1), 4);
  return (
    <Section id="projects" heading={p.heading}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: \`repeat(\${cols}, 1fr)\` }, gap: 3 }}>
        {p.items.map((pr: AnyObj) => (
          <Card key={pr.id} variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Box sx={{ height: 160, borderRadius: 2, mb: 1.5, backgroundImage: pr.image ? \`url(\${pr.image})\` : (t) => \`linear-gradient(135deg, \${t.palette.primary.main}, \${t.palette.secondary.main})\`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{pr.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ flex: 1, my: 1 }}>{pr.description}</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 1.5 }}>
                {pr.technologies.map((t: string) => <Chip key={t} label={t} size="small" variant="outlined" />)}
              </Box>
              <Stack direction="row" spacing={1}>
                {p.showGithub && pr.githubUrl && <Button size="small" href={pr.githubUrl} target="_blank">Code</Button>}
                {p.showDemo && pr.liveUrl && <Button size="small" variant="contained" href={pr.liveUrl} target="_blank">Live</Button>}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Section>
  );
}

function Testimonials() {
  const t = d.sections.testimonials;
  const cols = t.variant === "grid" ? 3 : 2;
  return (
    <Section id="testimonials" heading={t.heading}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: \`repeat(\${cols}, 1fr)\` }, gap: 3 }}>
        {t.items.map((it: AnyObj) => (
          <Card key={it.id} variant="outlined"><CardContent>
            <Typography sx={{ fontStyle: "italic", mb: 2 }}>"{it.quote}"</Typography>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Avatar src={it.avatar || undefined}>{it.name[0]}</Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700 }}>{it.name}</Typography>
                <Typography variant="body2" color="text.secondary">{[it.position, it.company].filter(Boolean).join(", ")}</Typography>
              </Box>
            </Stack>
          </CardContent></Card>
        ))}
      </Box>
    </Section>
  );
}

function Contact() {
  const c = d.sections.contact;
  return (
    <Section id="contact" heading={c.heading} alt>
      <Typography color="text.secondary" align="center" sx={{ mb: 4, maxWidth: 620, mx: "auto" }}>{c.description}</Typography>
      <Stack spacing={1.5} sx={{ alignItems: "center" }}>
        {c.email && <Typography>{c.email}</Typography>}
        {c.phone && <Typography color="text.secondary">{c.phone}</Typography>}
        {c.address && <Typography color="text.secondary">{c.address}</Typography>}
        {c.showContactForm && <Button variant="contained" size="large" href={\`mailto:\${c.email}\`} sx={{ mt: 2 }}>Send a message</Button>}
      </Stack>
    </Section>
  );
}

function Footer() {
  const f = d.footer;
  const year = new Date().getFullYear();
  return (
    <Box component="footer" sx={{ bgcolor: "background.paper", py: 4, borderTop: 1, borderColor: "divider" }}>
      <Container maxWidth={false} sx={{ maxWidth: d.theme.containerWidth }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
          {f.showCopyright && <Typography variant="body2" color="text.secondary">© {year} {d.sections.hero.name}. {f.copyrightText}</Typography>}
        </Stack>
      </Container>
    </Box>
  );
}

const COMPONENTS: AnyObj = { hero: Hero, about: About, skills: Skills, experience: Experience, projects: Projects, testimonials: Testimonials, contact: Contact };

export default function Portfolio() {
  const initial = d.theme.mode === "light" ? "light" : "dark";
  const [mode, setMode] = useState<"light" | "dark">(initial);
  const theme = useMemo(() => buildTheme(d.theme, mode), [mode]);
  const order = (d.sections.order as string[]).filter((k) => d.sections.visibility[k]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: "background.default", color: "text.primary", minHeight: "100vh" }}>
        <Header mode={mode} toggle={() => setMode((m) => (m === "dark" ? "light" : "dark"))} />
        {order.map((k) => { const C = COMPONENTS[k]; return <C key={k} />; })}
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
`;
