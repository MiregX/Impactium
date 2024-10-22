'use client'
import { PanelTemplate } from "@/components/PanelTempate";
import s from './../Account.module.css';
import { useUser } from "@/context/User.context";
import { useEffect, useMemo } from "react";
import { Button } from "@/ui/Button";
import { useLanguage } from "@/context/Language.context";
import Link from "next/link";
import { Icon } from "@/ui/Icon";
import { Card } from "@/ui/Card";

export default function AccountPage() {
  const { user, refreshInventory } = useUser();
  const { lang } = useLanguage();

  useEffect(() => {
    if (user?.inventory) return;

    refreshInventory();
  }, [user]);

  const prev = useMemo(() => (
    <Button variant='ghost' asChild>
      <Link href='/account'>
        {lang._account}
        <Icon name='CornerUpLeft' variant='dimmed' />
      </Link>
    </Button>
  ), []);

  return (
    <PanelTemplate className={s.page} title={lang._inventory} useAuthGuard={true} prev={prev}>
      <Card>
        
      </Card>
    </PanelTemplate>
  );
};
