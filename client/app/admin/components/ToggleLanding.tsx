'use client'
import { Card } from "@/ui/Card";
import { Switch } from "@/ui/Switch";
import s from '../Admin.module.css';
import { useApplication } from "@/context/Application.context";
import { Application, ApplicationBase } from "@impactium/types";
import { useState } from "react";


export function ToggleLanding() {
  const { application, setApplication } = useApplication();
  const [loading, setLoading] = useState<boolean>(false);

  const handle = async () => {
    setLoading(() => true);
    await api<Application>('/application/toggle/safe', (application) => setApplication(application || ApplicationBase));
    setLoading(() => false);
  }

  return (
    <Card>
      <h6>Безопасный режим</h6>
      <div className={s.safe_toggle_wrapper}>
        <Switch disabled={loading} checked={!!application.isSafeMode} onCheckedChange={handle}  />
        {application.isSafeMode ? 'Безопасный режим' : 'Пошёл нахуй'}
      </div>
    </Card>
  );
};
