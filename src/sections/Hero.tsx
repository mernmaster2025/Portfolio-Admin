"use client";

import { Box, Button, Container, Stack, Typography, Avatar, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { motion } from "framer-motion";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { SocialIcon, socialHref } from "@/lib/socialIcons";
import { useTyping } from "@/lib/useTyping";

function Initials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");
  return <>{initials.toUpperCase()}</>;
}

function Photo({ src, name, size }: { src: string; name: string; size: number }) {
  return (
    <Avatar
      src={src || undefined}
      sx={{
        width: size,
        height: size,
        fontSize: size / 3,
        fontWeight: 800,
        background: (t) => `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.secondary.main})`,
        boxShadow: 6,
      }}
    >
      {!src && <Initials name={name} />}
    </Avatar>
  );
}

function Socials({ size = "medium" }: { size?: "small" | "medium" }) {
  const socials = usePortfolioStore((s) => s.data.socials);
  if (!socials.length) return null;
  return (
    <Stack direction="row" spacing={1}>
      {socials.map((s) => (
        <IconButton
          key={s.id}
          component="a"
          href={socialHref(s)}
          target="_blank"
          rel="noreferrer"
          size={size}
          aria-label={s.platform}
        >
          <SocialIcon platform={s.platform} />
        </IconButton>
      ))}
    </Stack>
  );
}

function Ctas({ center }: { center?: boolean }) {
  const hero = usePortfolioStore((s) => s.data.sections.hero);
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{ justifyContent: center ? "center" : "flex-start" }}
    >
      {hero.primaryCtaLabel && (
        <Button variant="contained" size="large" href={hero.primaryCtaHref}>
          {hero.primaryCtaLabel}
        </Button>
      )}
      {hero.secondaryCtaLabel && (
        <Button variant="outlined" size="large" href={hero.secondaryCtaHref}>
          {hero.secondaryCtaLabel}
        </Button>
      )}
      {hero.showResumeButton && hero.resumeUrl && (
        <Button
          variant="text"
          size="large"
          startIcon={<DownloadIcon />}
          href={hero.resumeUrl}
          target="_blank"
        >
          Resume
        </Button>
      )}
    </Stack>
  );
}

function Headline({ center }: { center?: boolean }) {
  const hero = usePortfolioStore((s) => s.data.sections.hero);
  const animations = usePortfolioStore((s) => s.data.animations);
  const typed = useTyping(
    hero.roles.length ? hero.roles : [hero.title],
    hero.showTypingEffect && animations.preset !== "none"
  );

  return (
    <Stack
      spacing={2.5}
      sx={{
        alignItems: center ? "center" : "flex-start",
        textAlign: center ? "center" : "left",
      }}
    >
      <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 3 }}>
        Hello, I&apos;m
      </Typography>
      <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.05 }}>
        {hero.name}
      </Typography>
      <Typography variant="h5" color="text.secondary" sx={{ minHeight: "1.6em" }}>
        {hero.showTypingEffect ? (
          <>
            {typed}
            <Box component="span" sx={{ borderRight: "2px solid", ml: 0.3, animation: "blink 1s steps(1) infinite", "@keyframes blink": { "50%": { opacity: 0 } } }} />
          </>
        ) : (
          hero.title
        )}
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
        {hero.description}
      </Typography>
      <Ctas center={center} />
      {hero.showSocialLinks && <Socials />}
    </Stack>
  );
}

export function Hero() {
  const hero = usePortfolioStore((s) => s.data.sections.hero);
  const containerWidth = usePortfolioStore((s) => s.data.theme.containerWidth);
  const animations = usePortfolioStore((s) => s.data.animations);
  const animate = animations.heroAnimation && animations.preset !== "none";

  const variant = hero.variant;
  const fullscreen = variant === "fullscreen" || variant === "video";

  const content =
    variant === "split" ? (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: hero.showPhoto ? "1.2fr 0.8fr" : "1fr" },
          gap: 6,
          alignItems: "center",
        }}
      >
        <Headline />
        {hero.showPhoto && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Photo src={hero.profileImage} name={hero.name} size={300} />
          </Box>
        )}
      </Box>
    ) : variant === "minimal" ? (
      <Headline />
    ) : (
      <Stack spacing={4} sx={{ alignItems: "center" }}>
        {hero.showPhoto && <Photo src={hero.profileImage} name={hero.name} size={fullscreen ? 180 : 150} />}
        <Headline center />
      </Stack>
    );

  return (
    <Box
      component="section"
      id="hero"
      sx={{
        position: "relative",
        minHeight: fullscreen ? "100vh" : "auto",
        display: "flex",
        alignItems: "center",
        py: { xs: 8, md: fullscreen ? 0 : 12 },
        overflow: "hidden",
        background: (t) =>
          variant === "minimal"
            ? "background.default"
            : `radial-gradient(1200px 600px at 80% -10%, ${t.palette.primary.main}22, transparent), radial-gradient(900px 500px at 0% 110%, ${t.palette.secondary.main}22, transparent)`,
      }}
    >
      {variant === "video" && (
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            background: (t) =>
              `linear-gradient(135deg, ${t.palette.primary.main}33, ${t.palette.secondary.main}33)`,
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              backdropFilter: "blur(2px)",
              background: "rgba(0,0,0,0.25)",
            },
          }}
        />
      )}

      <Container maxWidth={false} sx={{ maxWidth: containerWidth, position: "relative" }}>
        {animate ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {content}
          </motion.div>
        ) : (
          content
        )}
      </Container>
    </Box>
  );
}
