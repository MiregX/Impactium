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
import Image from "next/image";
import { ui } from "@impactium/utils";
import { cn } from "@/lib/utils";
import { useApplication } from "@/context/Application.context";
import { λBlueprint } from "@/dto/Blueprint.dto";
import { ItemCombination } from "@/components/Item.combination";

export default function AccountPage() {
  const { blueprints } = useApplication();
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
    <PanelTemplate className={cn(s.page, s.inventory)} title={lang._inventory} useAuthGuard={true} prev={prev}>
      {user?.inventory?.map((item) => <ItemCombination key={item.id} item={item} />)}
    </PanelTemplate>
  );
};
