'use client'
import { cn } from "@/lib/utils";
import { Item, λItem } from "@/dto/Item.dto";
import { useLanguage } from "@/context/Language.context";
import { useApplication } from "@/context/Application.context";
import { Card } from "@/ui/Card";
import s from './styles/ItemCombination.module.css';
import { Separator } from "@/ui/Separator";
import { useMemo } from "react";

interface ItemCombinationProps {
  item: Item;
  icon: string;
}

export function ItemCombination({ item, icon }: ItemCombinationProps) {
  const { lang } = useLanguage();
  const { blueprints } = useApplication();

  const rare = useMemo(() => λItem.rare(blueprints, item), [blueprints, item]);

  return (
    <Card className={cn(s.unit, s[rare])} key={item.id}>
      {icon && <div className={s.icon} dangerouslySetInnerHTML={{ __html: icon }} />}
      <div className={s.title}>
        <h5>{lang.item[item.imprint]}</h5>
        <Separator orientation='vertical' />
        <span className={s.rare}>{rare}</span>
      </div>
    </Card>
  )
}



