"use client";

import { Box, Container, Divider, IconButton, Stack, Typography } from "@mui/material";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { SECTION_LABELS } from "@/lib/nav";
import { SocialIcon, socialHref } from "@/lib/socialIcons";
import type { SectionKey } from "@/schemas/portfolio";

export function PortfolioFooter() {
  const footer = usePortfolioStore((s) => s.data.footer);
  const theme = usePortfolioStore((s) => s.data.theme);
  const sections = usePortfolioStore((s) => s.data.sections);
  const socials = usePortfolioStore((s) => s.data.socials);
  const contact = usePortfolioStore((s) => s.data.sections.contact);
  const name = usePortfolioStore((s) => s.data.sections.hero.name);

  const year = new Date().getFullYear();
  const navItems = sections.order.filter((k) => sections.visibility[k]);
  const label = (k: SectionKey) => (k === "hero" ? "Home" : SECTION_LABELS[k]);

  const Social = footer.showSocialLinks && socials.length > 0 && (
    <Stack direction="row" spacing={0.5}>
      {socials.map((s) => (
        <IconButton key={s.id} component="a" href={socialHref(s)} target="_blank" rel="noreferrer" size="small" color="inherit" aria-label={s.platform}>
          <SocialIcon platform={s.platform} />
        </IconButton>
      ))}
    </Stack>
  );

  const Copyright = footer.showCopyright && (
    <Typography variant="body2" color="text.secondary">
      © {year} {name}. {footer.copyrightText}
    </Typography>
  );

  // Minimal / centered: single row
  if (footer.variant === "minimal" || footer.variant === "centered") {
    return (
      <Box component="footer" sx={{ bgcolor: "background.paper", py: 4, borderTop: 1, borderColor: "divider" }}>
        <Container maxWidth={false} sx={{ maxWidth: theme.containerWidth }}>
          <Stack
            direction={footer.variant === "centered" ? "column" : { xs: "column", sm: "row" }}
            spacing={2}
            sx={{ alignItems: "center", justifyContent: "space-between" }}
          >
            {Copyright}
            {Social}
          </Stack>
        </Container>
      </Box>
    );
  }

  // Developer / corporate / multi-column: column layout
  const cols = Math.min(Math.max(footer.columns, 1), 4);
  return (
    <Box component="footer" sx={{ bgcolor: "background.paper", pt: 6, pb: 4, borderTop: 1, borderColor: "divider" }}>
      <Container maxWidth={false} sx={{ maxWidth: theme.containerWidth }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: `repeat(${cols}, 1fr)` },
            gap: 4,
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 800 }}>
              {footer.variant === "developer" ? `<${name}/>` : name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {contact.description}
            </Typography>
            <Box sx={{ mt: 1.5 }}>{Social}</Box>
          </Box>

          {footer.showQuickLinks && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Quick Links
              </Typography>
              <Stack spacing={0.5}>
                {navItems.map((k) => (
                  <Typography key={k} component="a" href={`#${k}`} variant="body2" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                    {label(k)}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}

          {footer.showContactInfo && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Contact
              </Typography>
              <Stack spacing={0.5}>
                {contact.email && (
                  <Typography variant="body2" color="text.secondary">
                    {contact.email}
                  </Typography>
                )}
                {contact.phone && (
                  <Typography variant="body2" color="text.secondary">
                    {contact.phone}
                  </Typography>
                )}
                {contact.address && (
                  <Typography variant="body2" color="text.secondary">
                    {contact.address}
                  </Typography>
                )}
              </Stack>
            </Box>
          )}

          {cols >= 4 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Stay in touch
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Open to freelance & full-time opportunities.
              </Typography>
            </Box>
          )}
        </Box>
        <Divider sx={{ mb: 2 }} />
        {Copyright}
      </Container>
    </Box>
  );
}
