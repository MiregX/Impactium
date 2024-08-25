'use client'
import { Card } from "@/ui/Card";
import { Switch } from "@/ui/Switch";
import s from '../Admin.module.css';
import { useApplication } from "@/context/Application.context";
import { Application } from "@impactium/types";

export function ToggleLanding() {
  const { application } = useApplication();

  return (
    <Card>
      <h6>Безопасный режим</h6>
      <div className={s.safe_toggle_wrapper}>
        <Switch checked={!!application.isSafeMode} onCheckedChange={() => api<Application>('/application/toggle/safe')}  />
        {application.isSafeMode ? 'Безопасный режим' : 'Пошёл нахуй'}
      </div>
    </Card>
  );
};
