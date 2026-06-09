"use client";

import { useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DataObjectIcon from "@mui/icons-material/DataObject";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { generateProjectFiles, downloadProjectZip } from "@/lib/export/generateProject";

export default function ExportPanel() {
  const data = usePortfolioStore((s) => s.data);
  const importData = usePortfolioStore((s) => s.importData);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const files = Object.keys(generateProjectFiles(data)).sort();

  const handleZip = async () => {
    setBusy(true);
    setMsg(null);
    try {
      await downloadProjectZip(data);
      setMsg({ type: "success", text: "portfolio-export.zip downloaded." });
    } catch (e) {
      setMsg({ type: "error", text: `Export failed: ${(e as Error).message}` });
    } finally {
      setBusy(false);
    }
  };

  const handleJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const res = importData(parsed);
        setMsg(
          res.success
            ? { type: "success", text: "Portfolio imported successfully." }
            : { type: "error", text: `Invalid schema — ${res.error}` }
        );
      } catch {
        setMsg({ type: "error", text: "That file isn't valid JSON." });
      }
    };
    reader.readAsText(file);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 980, mx: "auto", width: "100%" }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
        Export your portfolio
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Generate a complete, standalone Next.js project — production-ready and independent of this
        builder. Deploy it anywhere.
      </Typography>

      {msg && (
        <Alert severity={msg.type} sx={{ mb: 3 }} onClose={() => setMsg(null)}>
          {msg.text}
        </Alert>
      )}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Download
            </Typography>
            <Stack spacing={1.5}>
              <Button variant="contained" size="large" startIcon={<DownloadIcon />} onClick={handleZip} disabled={busy}>
                {busy ? "Building ZIP…" : "Download standalone project (.zip)"}
              </Button>
              <Button variant="outlined" startIcon={<DataObjectIcon />} onClick={handleJson}>
                Download portfolio.json
              </Button>
            </Stack>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Import
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Load a previously exported <code>portfolio.json</code> to continue editing.
            </Typography>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImport(f);
                e.target.value = "";
              }}
            />
            <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => fileRef.current?.click()}>
              Import portfolio.json
            </Button>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Project structure
            </Typography>
            <List dense>
              {files.map((f) => (
                <ListItem key={f} disableGutters>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <InsertDriveFileIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={`portfolio-export/${f}`} slotProps={{ primary: { sx: { fontFamily: "monospace", fontSize: 13 } } }} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
