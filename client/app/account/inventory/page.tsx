'use client'
import { PanelTemplate } from "@/components/PanelTempate";
import s from './Inventory.module.css';
import { useUser } from "@/context/User.context";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/ui/Button";
import { useLanguage } from "@/context/Language.context";
import Link from "next/link";
import { Icon } from "@impactium/icons";
import { cn } from "@/lib/utils";
import { FilterOptions } from "./components/FilterOptions";
import { ItemFilter, λItem } from "@/dto/Item.dto";
import { ItemCombination } from "@/components/Item.combination";
import { useApplication } from "@/context/Application.context";
import { useInventory } from "./inventory.context";

export type FilterKey = 'rare' | 'category';

export default function AccountPage() {
  const { blueprints } = useApplication();
  const { inventory, refreshInventory, icons } = useInventory();
  const [filter, setFilter] = useState<ItemFilter>({
    rare: [],
    category: []
  });
  const { lang } = useLanguage();

  useEffect(() => {
    if (!inventory.length) refreshInventory();
  }, [inventory]);

  const prev = useMemo(() => (
    <Button variant='ghost' asChild>
      <Link href='/account'>
        {lang._account}
        <Icon name='CornerUpLeft' variant='dimmed' />
      </Link>
    </Button>
  ), [lang]);

  return (
    <PanelTemplate className={cn(s.page, s.inventory)} title={lang._inventory} useAuthGuard={true} prev={prev}>
      <FilterOptions setFilter={setFilter} filter={filter} />
      <div className={s.list}>
        {λItem.filter(blueprints, inventory, filter).map((item) => <ItemCombination key={item.id} item={item} />)}
      </div>
    </PanelTemplate>
  );
};
