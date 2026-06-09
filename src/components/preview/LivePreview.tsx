"use client";

import {
  Box,
  Divider,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import TabletMacIcon from "@mui/icons-material/TabletMac";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import BrightnessAutoIcon from "@mui/icons-material/BrightnessAuto";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useState } from "react";
import { useUiStore, type PreviewDevice, type PreviewColorMode } from "@/stores/uiStore";

const DEVICE_WIDTH: Record<PreviewDevice, number | null> = {
  desktop: null, // fluid
  tablet: 834,
  mobile: 390,
};

export default function LivePreview() {
  const device = useUiStore((s) => s.previewDevice);
  const setDevice = useUiStore((s) => s.setPreviewDevice);
  const colorMode = useUiStore((s) => s.previewColorMode);
  const setColorMode = useUiStore((s) => s.setPreviewColorMode);
  const [nonce, setNonce] = useState(0);

  const width = DEVICE_WIDTH[device];

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        minWidth: 0,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: "center", px: 2, py: 1, borderBottom: 1, borderColor: "divider", flexWrap: "wrap" }}
      >
        <Typography variant="subtitle2" color="text.secondary" sx={{ mr: "auto" }}>
          Live Preview
        </Typography>

        <ToggleButtonGroup
          size="small"
          exclusive
          value={device}
          onChange={(_, v: PreviewDevice | null) => v && setDevice(v)}
        >
          <ToggleButton value="desktop" aria-label="Desktop">
            <DesktopWindowsIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="tablet" aria-label="Tablet">
            <TabletMacIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="mobile" aria-label="Mobile">
            <PhoneIphoneIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          size="small"
          exclusive
          value={colorMode}
          onChange={(_, v: PreviewColorMode | null) => v && setColorMode(v)}
        >
          <ToggleButton value="auto" aria-label="Auto color mode">
            <BrightnessAutoIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="light" aria-label="Light">
            <LightModeIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="dark" aria-label="Dark">
            <DarkModeIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />
        <Tooltip title="Reload preview">
          <IconButton size="small" onClick={() => setNonce((n) => n + 1)}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Open in new tab">
          <IconButton size="small" component="a" href="/preview" target="_blank">
            <OpenInNewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          p: device === "desktop" ? 0 : 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          bgcolor: (t) => (t.palette.mode === "dark" ? "#05060a" : "#e9edf5"),
        }}
      >
        <Box
          sx={{
            width: width ?? "100%",
            maxWidth: "100%",
            height: "100%",
            flexShrink: 0,
            borderRadius: device === "desktop" ? 0 : 3,
            overflow: "hidden",
            border: device === "desktop" ? 0 : 8,
            borderColor: "#1f2430",
            boxShadow: device === "desktop" ? "none" : 8,
            bgcolor: "background.default",
          }}
        >
          <iframe
            key={`${device}-${nonce}`}
            src="/preview"
            title="Portfolio live preview"
            style={{ width: "100%", height: "100%", border: 0, display: "block" }}
          />
        </Box>
      </Box>
    </Box>
  );
}
