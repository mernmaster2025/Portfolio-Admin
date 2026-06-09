"use client";

import { Box, Card, CardContent, Stack, Typography, Link as MuiLink } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { SectionShell } from "./SectionShell";
import { Reveal } from "@/components/preview/Reveal";
import { ContactForm } from "./ContactForm";

function InfoRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
      <Box sx={{ color: "primary.main", display: "grid", placeItems: "center" }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography sx={{ fontWeight: 600 }}>
          {href ? (
            <MuiLink href={href} color="inherit" underline="hover">
              {value}
            </MuiLink>
          ) : (
            value
          )}
        </Typography>
      </Box>
    </Stack>
  );
}

function ContactInfo() {
  const c = usePortfolioStore((s) => s.data.sections.contact);
  return (
    <Stack spacing={2.5}>
      {c.email && <InfoRow icon={<EmailIcon />} label="Email" value={c.email} href={`mailto:${c.email}`} />}
      {c.phone && <InfoRow icon={<PhoneIcon />} label="Phone" value={c.phone} href={`tel:${c.phone}`} />}
      {c.address && <InfoRow icon={<PlaceIcon />} label="Location" value={c.address} />}
    </Stack>
  );
}

function MapBox() {
  return (
    <Box
      sx={{
        minHeight: 220,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        display: "grid",
        placeItems: "center",
        background: (t) => `linear-gradient(135deg, ${t.palette.primary.main}11, ${t.palette.secondary.main}11)`,
      }}
    >
      <Stack spacing={1} sx={{ alignItems: "center", color: "text.secondary" }}>
        <PlaceIcon fontSize="large" color="primary" />
        <Typography variant="body2">Map embed placeholder</Typography>
      </Stack>
    </Box>
  );
}

export function Contact() {
  const c = usePortfolioStore((s) => s.data.sections.contact);

  return (
    <SectionShell id="contact" heading={c.heading} eyebrow="Get in touch" alt>
      <Typography color="text.secondary" align="center" sx={{ mb: 4, maxWidth: 620, mx: "auto" }}>
        {c.description}
      </Typography>

      {c.variant === "simple" ? (
        <Box sx={{ maxWidth: 560, mx: "auto" }}>
          <Reveal>
            <Stack spacing={3} sx={{ alignItems: "center" }}>
              <ContactInfo />
              {c.showContactForm && <Box sx={{ width: "100%" }}><ContactForm /></Box>}
            </Stack>
          </Reveal>
        </Box>
      ) : c.variant === "cards" ? (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)" }, gap: 2, maxWidth: 900, mx: "auto" }}>
          {[
            c.email && { icon: <EmailIcon />, label: "Email", value: c.email, href: `mailto:${c.email}` },
            c.phone && { icon: <PhoneIcon />, label: "Phone", value: c.phone, href: `tel:${c.phone}` },
            c.address && { icon: <PlaceIcon />, label: "Location", value: c.address },
          ]
            .filter(Boolean)
            .map((info, i) => {
              const item = info as { icon: React.ReactNode; label: string; value: string; href?: string };
              return (
                <Reveal key={i} delay={i * 0.05}>
                  <Card variant="outlined" sx={{ textAlign: "center", height: "100%" }}>
                    <CardContent>
                      <Box sx={{ color: "primary.main", mb: 1 }}>{item.icon}</Box>
                      <Typography variant="caption" color="text.secondary">
                        {item.label}
                      </Typography>
                      <Typography sx={{ fontWeight: 600 }}>{item.value}</Typography>
                    </CardContent>
                  </Card>
                </Reveal>
              );
            })}
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 4, md: 6 },
            alignItems: "start",
            maxWidth: 1000,
            mx: "auto",
          }}
        >
          <Reveal>
            <Stack spacing={3}>
              <ContactInfo />
              {c.variant === "map" && c.showMap && <MapBox />}
            </Stack>
          </Reveal>
          {c.showContactForm && (
            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          )}
        </Box>
      )}
    </SectionShell>
  );
}
