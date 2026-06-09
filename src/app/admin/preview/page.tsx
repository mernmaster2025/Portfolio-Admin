import { Box } from "@mui/material";
import LivePreview from "@/components/preview/LivePreview";

export default function PreviewPage() {
  return (
    <Box sx={{ flex: 1, minHeight: 0, display: "flex" }}>
      <LivePreview />
    </Box>
  );
}
