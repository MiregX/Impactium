'use client';
import { cn } from "@/lib/utils";
import { λBlueprint } from "@/dto/Blueprint.dto";
import { Item } from "@/dto/Item.dto";
import { useLanguage } from "@/context/Language.context";
import { useApplication } from "@/context/Application.context";
import { Card } from "@/ui/Card";
import s from './styles/ItemCombination.module.css';
import Image from "next/image";
import { ui } from "@impactium/utils";
import { Badge, BadgeType } from "@/ui/Badge";
import { Separator } from "@/ui/Separator";

interface ItemCombinationProps {
  item: Item;
}

export function ItemCombination({ item }: ItemCombinationProps) {
  const { lang } = useLanguage();
  const { blueprints } = useApplication();

  const rare = λBlueprint.rare(blueprints, item);

  return (
    <Card className={cn(s.unit, s[rare])} key={item.id}>
      <Image
        priority
        src={ui(`/item/${item.imprint}`)}
        alt={lang.item[item.imprint]}
        width={96}
        height={96}
      />
      <div className={s.title}>
        <h5>{lang.item[item.imprint]}</h5>
        <Separator orientation='vertical' />
        <span className={s.rare}>{rare}</span>
      </div>
    </Card>
  )
}