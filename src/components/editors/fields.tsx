"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  MenuItem,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

/** A titled group of related controls. */
export function EditorCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card variant="outlined" sx={{ mb: 2.5 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
        )}
        <Stack spacing={2} sx={{ mt: description ? 0 : 2 }}>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  multiline,
  error,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  error?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <TextField
      label={label}
      value={value}
      type={type}
      onChange={(e) => onChange(e.target.value)}
      multiline={multiline}
      minRows={multiline ? 3 : undefined}
      fullWidth
      size="small"
      placeholder={placeholder}
      error={!!error}
      helperText={error}
    />
  );
}

export function SelectInput<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <TextField select label={label} value={value} onChange={(e) => onChange(e.target.value as T)} fullWidth size="small">
      {options.map((o) => (
        <MenuItem key={o.value} value={o.value}>
          {o.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

export function SwitchInput({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={(e) => onChange(e.target.checked)} />}
      label={label}
      sx={{ m: 0, justifyContent: "space-between", display: "flex", ml: 0 }}
      labelPlacement="start"
    />
  );
}

export function SliderInput({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2" color="text.secondary">
          {value}
          {unit}
        </Typography>
      </Stack>
      <Slider value={value} min={min} max={max} step={step} onChange={(_, v) => onChange(v as number)} />
    </Box>
  );
}

export function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const valid = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
      <Box
        component="input"
        type="color"
        value={valid ? value : "#000000"}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
        sx={{
          width: 44,
          height: 40,
          p: 0,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "transparent",
          cursor: "pointer",
        }}
      />
      <TextField
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        size="small"
        fullWidth
        error={!valid}
        helperText={!valid ? "Enter a valid hex color" : undefined}
      />
    </Stack>
  );
}

/** Editable list of string tags (technologies, keywords, roles, …). */
export function ChipsInput({
  label,
  values,
  onChange,
  placeholder = "Type and press Enter",
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setDraft("");
  };
  return (
    <Box>
      <TextField
        label={label}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        size="small"
        fullWidth
        placeholder={placeholder}
      />
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1 }}>
        {values.map((v) => (
          <Chip key={v} label={v} size="small" onDelete={() => onChange(values.filter((x) => x !== v))} />
        ))}
      </Box>
    </Box>
  );
}
