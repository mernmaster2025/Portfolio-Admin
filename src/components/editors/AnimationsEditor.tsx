"use client";

import { Box } from "@mui/material";
import { useAnimationStore } from "@/stores/domains";
import { EditorCard, SelectInput, SwitchInput } from "./fields";

export default function AnimationsEditor() {
  const { animations, updateAnimations } = useAnimationStore();

  return (
    <Box>
      <EditorCard title="Preset" description="Sets the overall motion personality of the portfolio.">
        <SelectInput
          label="Animation preset"
          value={animations.preset}
          onChange={(preset) => updateAnimations({ preset })}
          options={[
            { value: "none", label: "None" },
            { value: "minimal", label: "Minimal" },
            { value: "smooth", label: "Smooth" },
            { value: "dynamic", label: "Dynamic" },
            { value: "futuristic", label: "Futuristic" },
          ]}
        />
      </EditorCard>

      <EditorCard title="Effects">
        <SwitchInput label="Page transitions" checked={animations.pageTransitions} onChange={(v) => updateAnimations({ pageTransitions: v })} />
        <SwitchInput label="Scroll reveal" checked={animations.scrollReveal} onChange={(v) => updateAnimations({ scrollReveal: v })} />
        <SwitchInput label="Section animation" checked={animations.sectionAnimation} onChange={(v) => updateAnimations({ sectionAnimation: v })} />
        <SwitchInput label="Hero animation" checked={animations.heroAnimation} onChange={(v) => updateAnimations({ heroAnimation: v })} />
        <SwitchInput label="Cursor effects" checked={animations.cursorEffects} onChange={(v) => updateAnimations({ cursorEffects: v })} />
        <SwitchInput label="Particle effects" checked={animations.particleEffects} onChange={(v) => updateAnimations({ particleEffects: v })} />
      </EditorCard>
    </Box>
  );
}
