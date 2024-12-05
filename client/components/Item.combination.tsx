'use client'
import { cn } from "@impactium/utils";
import { Item, λItem } from "@/dto/Item.dto";
import { useLanguage } from "@/context/Language.context";
import { useApplication } from "@/context/Application.context";
import { Card } from "@/ui/Card";
import s from './styles/ItemCombination.module.css';
import { Separator } from "@/ui/Separator";
import { useMemo } from "react";
import { useInventory } from "@/app/account/inventory/inventory.context";
import { Badge, BadgeType } from "@/ui/Badge";

interface ItemCombinationProps {
  item: Item;
}

export function ItemCombination({ item }: ItemCombinationProps) {
  const { lang } = useLanguage();
  const { blueprints } = useApplication();
  const { icons } = useInventory();

  const rare = useMemo(() => λItem.rare(blueprints, item), [blueprints, item]);

  return (
    <Card className={cn(s.unit, s[rare])} key={item.id}>
      <div className={s.icon}>
        {icons[item.imprint]}
        {icons[item.imprint]}
      </div>
      <div className={s.title}>
        <h5>{lang.item[item.imprint]}</h5>
        <p className={s.amount}>x{item.amount}</p>
        <Badge type={BadgeType[rare]} className={s.rare}>{rare}</Badge>
      </div>
    </Card>
  )
}



