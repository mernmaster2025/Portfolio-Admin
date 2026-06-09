"use client";

import Link from "next/link";
import {
  Box,
  Card,
  IconButton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSectionStore } from "@/stores/domains";
import { SECTION_LABELS } from "@/lib/nav";
import type { SectionKey } from "@/schemas/portfolio";

function Row({ id }: { id: SectionKey }) {
  const { visibility, toggleSectionVisibility } = useSectionStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <Card
      ref={setNodeRef}
      variant="outlined"
      sx={{
        p: 1.5,
        mb: 1,
        opacity: isDragging ? 0.6 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <IconButton size="small" sx={{ cursor: "grab" }} {...attributes} {...listeners} aria-label="Drag to reorder">
          <DragIndicatorIcon />
        </IconButton>
        <Typography sx={{ flex: 1, fontWeight: 600, opacity: visibility[id] ? 1 : 0.5 }}>
          {SECTION_LABELS[id]}
        </Typography>
        <IconButton size="small" component={Link} href={`/admin/sections/${id}`} aria-label={`Edit ${SECTION_LABELS[id]}`}>
          <EditIcon fontSize="small" />
        </IconButton>
        <Switch checked={visibility[id]} onChange={() => toggleSectionVisibility(id)} />
      </Stack>
    </Card>
  );
}

export default function SectionManager() {
  const { order, setSectionOrder } = useSectionStore();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(active.id as SectionKey);
    const newIndex = order.indexOf(over.id as SectionKey);
    setSectionOrder(arrayMove(order, oldIndex, newIndex));
  };

  return (
    <Box sx={{ maxWidth: 560 }}>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Drag to reorder, toggle visibility, or click the pencil to edit a section&apos;s content and
        layout. The navigation menu updates automatically.
      </Typography>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          {order.map((key) => (
            <Row key={key} id={key} />
          ))}
        </SortableContext>
      </DndContext>
    </Box>
  );
}
