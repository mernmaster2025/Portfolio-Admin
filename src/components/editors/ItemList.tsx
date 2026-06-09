"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";

/** Generic editor for an array of identified items, with add/remove + per-item fields. */
export function ItemList<T extends { id: string }>({
  items,
  onChange,
  makeNew,
  title,
  addLabel,
  renderItem,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  makeNew: () => T;
  title: (item: T, index: number) => string;
  addLabel: string;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  const update = (id: string, patch: Partial<T>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const remove = (id: string) => onChange(items.filter((it) => it.id !== id));

  return (
    <Box>
      {items.map((item, i) => (
        <Accordion key={item.id} disableGutters defaultExpanded={false} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ flex: 1, fontWeight: 600 }}>{title(item, i)}</Typography>
            <IconButton
              size="small"
              component="span"
              onClick={(e) => {
                e.stopPropagation();
                remove(item.id);
              }}
              aria-label="Delete item"
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>{renderItem(item, (patch) => update(item.id, patch))}</Stack>
          </AccordionDetails>
        </Accordion>
      ))}
      <Button startIcon={<AddIcon />} onClick={() => onChange([...items, makeNew()])} variant="outlined" fullWidth sx={{ mt: 1 }}>
        {addLabel}
      </Button>
    </Box>
  );
}

/** Stable-ish unique id generator for new items (browser only). */
export function newId(prefix: string): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.floor(performance.now()).toString(36);
  return `${prefix}_${rand}`;
}
