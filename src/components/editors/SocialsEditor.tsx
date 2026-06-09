"use client";

import { useSocialsStore } from "@/stores/domains";
import { SOCIAL_PLATFORMS } from "@/lib/socialIcons";
import type { SocialLink } from "@/schemas/portfolio";
import { EditorCard, SelectInput, TextInput } from "./fields";
import { ItemList, newId } from "./ItemList";

export default function SocialsEditor() {
  const { socials, setSocials } = useSocialsStore();

  return (
    <EditorCard title="Social Links" description="Shared across the header, footer, and hero.">
      <ItemList
        items={socials}
        onChange={setSocials}
        makeNew={(): SocialLink => ({ id: newId("social"), platform: "github", url: "" })}
        addLabel="Add social link"
        title={(s) => `${s.platform}`}
        renderItem={(item, update) => (
          <>
            <SelectInput
              label="Platform"
              value={item.platform}
              onChange={(platform) => update({ platform: platform as SocialLink["platform"] })}
              options={SOCIAL_PLATFORMS.map((p) => ({ value: p, label: p }))}
            />
            <TextInput
              label="URL"
              value={item.url}
              onChange={(url) => update({ url })}
              placeholder="https://… (or email address)"
            />
          </>
        )}
      />
    </EditorCard>
  );
}
