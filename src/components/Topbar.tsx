"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DownloadIcon from "@mui/icons-material/Download";
import { useUiStore } from "@/stores/uiStore";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { SIDEBAR_WIDTH } from "./Sidebar";

export default function Topbar({
  title,
  onMenuClick,
}: {
  title: string;
  onMenuClick: () => void;
}) {
  const adminMode = useUiStore((s) => s.adminMode);
  const toggleAdminMode = useUiStore((s) => s.toggleAdminMode);
  const reset = usePortfolioStore((s) => s.reset);
  const [menuEl, setMenuEl] = useState<null | HTMLElement>(null);

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        ml: { md: `${SIDEBAR_WIDTH}px` },
        borderBottom: 1,
        borderColor: "divider",
        backdropFilter: "blur(8px)",
        backgroundColor: (t) =>
          t.palette.mode === "dark" ? "rgba(20,23,31,0.8)" : "rgba(255,255,255,0.8)",
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { md: "none" } }}
          aria-label="Open navigation"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexShrink: 0 }}>
          {title}
        </Typography>
        <Box sx={{ flex: 1 }} />

        <Button
          component={Link}
          href="/admin/export"
          variant="contained"
          startIcon={<DownloadIcon />}
          sx={{ display: { xs: "none", sm: "inline-flex" } }}
        >
          Export
        </Button>

        <Tooltip title={`Switch to ${adminMode === "dark" ? "light" : "dark"} dashboard`}>
          <IconButton onClick={toggleAdminMode} aria-label="Toggle dashboard theme">
            {adminMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="More">
          <IconButton onClick={(e) => setMenuEl(e.currentTarget)} aria-label="More actions">
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
        <Menu anchorEl={menuEl} open={!!menuEl} onClose={() => setMenuEl(null)}>
          <MenuItem component={Link} href="/admin/preview" onClick={() => setMenuEl(null)}>
            Open full preview
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              setMenuEl(null);
              if (confirm("Reset all portfolio content to defaults? This cannot be undone.")) {
                reset();
              }
            }}
          >
            <RestartAltIcon fontSize="small" style={{ marginRight: 8 }} />
            Reset to defaults
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
