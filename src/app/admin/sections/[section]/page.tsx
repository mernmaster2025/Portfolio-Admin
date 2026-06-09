import { notFound } from "next/navigation";
import EditorShell from "@/components/editors/EditorShell";
import SectionEditorSwitch from "@/components/editors/SectionEditorSwitch";
import { sectionKeys, type SectionKey } from "@/schemas/portfolio";

export default async function SectionEditorPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!sectionKeys.includes(section as SectionKey)) notFound();

  return (
    <EditorShell>
      <SectionEditorSwitch section={section as SectionKey} />
    </EditorShell>
  );
}
