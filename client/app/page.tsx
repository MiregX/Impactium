'use client'
import { Cloud } from '@/components/main/hosting/Cloud';
import { Challenge } from '@/components/main/hosting/Challenge';
import { PanelTemplate } from '@/components/main/PanelTempate';

export default function Main() {
 
  return (
    <PanelTemplate>
      <Challenge />
      <Cloud />
    </PanelTemplate>
  );
};
