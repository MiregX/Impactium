'use client'
import { PanelTemplate } from "@/components/PanelTempate";
import { useChangelog } from "./context";

export default function ChangelogPage() {
  const { changelog } = useChangelog();

  return (
    <PanelTemplate>
      {null}
    </PanelTemplate>
  )

}