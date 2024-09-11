import { PanelTemplate } from "@/components/PanelTempate";
import { Children } from "@/types";

export default function AdminBypassLayout({ children }: Children) {
  return (
    <PanelTemplate center>
      {children}
    </PanelTemplate>
  )
}