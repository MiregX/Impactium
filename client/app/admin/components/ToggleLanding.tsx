'use client'
import { Card } from "@/ui/Card";
import { Switch } from "@/ui/Switch";
import s from '../Admin.module.css';
import { useApplication } from "@/context/Application.context";

export function ToggleLanding() {
  const { application } = Application.use();

  return (
    <Card>
      <h6>Безопасный режим</h6>
      <div className={s.safe_toggle_wrapper}>
        <Switch checked={!!application.isSafeMode} onCheckedChange={() => api<any>('/application/toggle/safe')}  />
        {application.isSafeMode ? 'Безопасный режим' : 'Пошёл нахуй'}
      </div>
    </Card>
  );
};
