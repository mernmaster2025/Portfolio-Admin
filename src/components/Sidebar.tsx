"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
  Typography,
  Chip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PaletteIcon from "@mui/icons-material/Palette";
import ViewDayIcon from "@mui/icons-material/ViewDay";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CircleIcon from "@mui/icons-material/Circle";
import { NAV, type NavItem } from "@/lib/nav";

export const SIDEBAR_WIDTH = 264;

const ICONS: Record<string, React.ElementType> = {
  Dashboard: DashboardIcon,
  Palette: PaletteIcon,
  ViewDay: ViewDayIcon,
  HorizontalRule: HorizontalRuleIcon,
  AutoAwesome: AutoAwesomeIcon,
  Search: SearchIcon,
  Visibility: VisibilityIcon,
  Download: DownloadIcon,
};

function NavRow({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = ICONS[item.icon] ?? DashboardIcon;
  const hasChildren = !!item.children?.length;
  const childActive = item.children?.some((c) => pathname === c.href);
  const [open, setOpen] = useState<boolean>(Boolean(childActive));
  const active = pathname === item.href;

  return (
    <>
      <ListItemButton
        component={hasChildren ? "div" : Link}
        href={hasChildren ? undefined : item.href}
        selected={active}
        onClick={hasChildren ? () => setOpen((o) => !o) : undefined}
        sx={{ borderRadius: 2, mx: 1, mb: 0.5 }}
      >
        <ListItemIcon sx={{ minWidth: 38 }}>
          <Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontWeight: 600 } } }} />
        {hasChildren ? open ? <ExpandLess /> : <ExpandMore /> : null}
      </ListItemButton>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding>
            {item.children!.map((child) => (
              <ListItemButton
                key={child.href}
                component={Link}
                href={child.href}
                selected={pathname === child.href}
                sx={{ borderRadius: 2, mx: 1, mb: 0.25, pl: 4 }}
              >
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <CircleIcon sx={{ fontSize: 8 }} />
                </ListItemIcon>
                <ListItemText
                  primary={child.label}
                  slotProps={{ primary: { variant: "body2" } }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar sx={{ gap: 1.5 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 2,
            background: "linear-gradient(135deg,#6366f1,#ec4899)",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            fontWeight: 800,
          }}
        >
          P
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, lineHeight: 1 }}>
            Portfolio
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Builder
          </Typography>
        </Box>
        <Chip label="SaaS" size="small" color="primary" variant="outlined" sx={{ ml: "auto" }} />
      </Toolbar>
      <List sx={{ flex: 1, overflowY: "auto", py: 1 }}>
        {NAV.map((item) => (
          <NavRow key={item.href} item={item} pathname={pathname} />
        ))}
      </List>
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Schema-driven · v1.0
        </Typography>
      </Box>
    </Box>
  );
}

export default function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Permanent drawer (desktop) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH, boxSizing: "border-box" },
        }}
        open
      >
        <SidebarContent pathname={pathname} />
      </Drawer>
      {/* Temporary drawer (mobile) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH, boxSizing: "border-box" },
        }}
      >
        <SidebarContent pathname={pathname} />
      </Drawer>
    </>
  );
}
