"use client";

import { Box } from "@mui/material";
import { useFooterStore } from "@/stores/domains";
import { EditorCard, SelectInput, SwitchInput, SliderInput, TextInput } from "./fields";

export default function FooterEditor() {
  const { footer, updateFooter } = useFooterStore();

  return (
    <Box>
      <EditorCard title="Style">
        <SelectInput
          label="Variant"
          value={footer.variant}
          onChange={(variant) => updateFooter({ variant })}
          options={[
            { value: "minimal", label: "Minimal" },
            { value: "developer", label: "Developer" },
            { value: "corporate", label: "Corporate" },
            { value: "centered", label: "Centered" },
            { value: "multi-column", label: "Multi Column" },
          ]}
        />
        <SliderInput
          label="Columns"
          value={footer.columns}
          min={1}
          max={4}
          onChange={(columns) => updateFooter({ columns })}
        />
      </EditorCard>

      <EditorCard title="Content">
        <TextInput
          label="Copyright text"
          value={footer.copyrightText}
          onChange={(copyrightText) => updateFooter({ copyrightText })}
        />
        <SwitchInput label="Show copyright" checked={footer.showCopyright} onChange={(showCopyright) => updateFooter({ showCopyright })} />
        <SwitchInput label="Show social links" checked={footer.showSocialLinks} onChange={(showSocialLinks) => updateFooter({ showSocialLinks })} />
        <SwitchInput label="Show quick links" checked={footer.showQuickLinks} onChange={(showQuickLinks) => updateFooter({ showQuickLinks })} />
        <SwitchInput label="Show contact info" checked={footer.showContactInfo} onChange={(showContactInfo) => updateFooter({ showContactInfo })} />
      </EditorCard>
    </Box>
  );
}
