import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LanguageIcon from "@mui/icons-material/Language";
import EmailIcon from "@mui/icons-material/Email";
import BrushIcon from "@mui/icons-material/Brush";
import type { SocialLink } from "@/schemas/portfolio";

const MAP: Record<SocialLink["platform"], React.ElementType> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
  dribbble: BrushIcon,
  behance: BrushIcon,
  website: LanguageIcon,
  email: EmailIcon,
};

export function SocialIcon({
  platform,
  fontSize = "small",
}: {
  platform: SocialLink["platform"];
  fontSize?: "small" | "medium" | "large" | "inherit";
}) {
  const Icon = MAP[platform] ?? LanguageIcon;
  return <Icon fontSize={fontSize} />;
}

export const SOCIAL_PLATFORMS = Object.keys(MAP) as SocialLink["platform"][];

/** Normalize a social link into a clickable href (mailto for email). */
export function socialHref(link: SocialLink): string {
  if (link.platform === "email") {
    return link.url.startsWith("mailto:") ? link.url : `mailto:${link.url}`;
  }
  return link.url;
}
