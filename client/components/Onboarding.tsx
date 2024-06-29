import { PanelTemplate } from "./PanelTempate";
import { VideoHighlight } from './VideoHighlight';
import { Text } from "./Text";

export function Onboarding() {
  return (
    <PanelTemplate fullscreen={true}>
      <VideoHighlight />
      <Text />
    </PanelTemplate>
  );
}