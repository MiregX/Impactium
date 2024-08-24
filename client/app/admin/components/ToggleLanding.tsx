import { Card } from "@/ui/Card";
import { Switch } from "@/ui/Switch";
import { useState } from "react";
import s from '../Admin.module.css';

export function ToggleLanding() {
  const [isSafeMode, setIsSafeMode] = useState<boolean>(false);

  return (
    <Card>
      <h6>Безопасный режим</h6>
      <div className={s.safe_toggle_wrapper}>
        <Switch checked={isSafeMode} onCheckedChange={() => setIsSafeMode((isSafeMode) => !isSafeMode)}  />
        {isSafeMode ? 'Безопасный режим' : 'Пошёл нахуй'}
      </div>
    </Card>
  );
};
