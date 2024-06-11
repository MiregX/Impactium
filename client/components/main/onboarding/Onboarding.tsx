import { PanelTemplate } from "../PanelTempate";
import { VideoHighlight } from './VideoHighlight';
import { Onboard } from "../onboard/Onboard";

export function Onboarding() {
  return (
    <PanelTemplate fullscreen={true}>
      <VideoHighlight />
      <Onboard />
    </PanelTemplate>
  );
}