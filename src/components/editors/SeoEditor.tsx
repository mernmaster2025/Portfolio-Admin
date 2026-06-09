"use client";

import { Box } from "@mui/material";
import { useSeoStore } from "@/stores/domains";
import { EditorCard, ChipsInput, TextInput } from "./fields";

export default function SeoEditor() {
  const { seo, updateSeo } = useSeoStore();
  const urlError =
    seo.canonicalUrl && !/^https?:\/\/.+/.test(seo.canonicalUrl)
      ? "Enter a valid URL (https://…)"
      : undefined;

  return (
    <Box>
      <EditorCard title="Meta">
        <TextInput label="Meta title" value={seo.metaTitle} onChange={(metaTitle) => updateSeo({ metaTitle })} />
        <TextInput label="Meta description" multiline value={seo.metaDescription} onChange={(metaDescription) => updateSeo({ metaDescription })} />
        <ChipsInput label="Keywords" values={seo.keywords} onChange={(keywords) => updateSeo({ keywords })} />
      </EditorCard>

      <EditorCard title="Social sharing">
        <TextInput label="Open Graph image URL" value={seo.ogImage} onChange={(ogImage) => updateSeo({ ogImage })} placeholder="https://…/og.png" />
        <TextInput label="Twitter image URL" value={seo.twitterImage} onChange={(twitterImage) => updateSeo({ twitterImage })} placeholder="https://…/twitter.png" />
        <TextInput label="Canonical URL" value={seo.canonicalUrl} onChange={(canonicalUrl) => updateSeo({ canonicalUrl })} error={urlError} placeholder="https://yourdomain.com" />
      </EditorCard>
    </Box>
  );
}
