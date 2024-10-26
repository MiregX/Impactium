import { cn, SetState } from "@/lib/utils";
import s from "../Inventory.module.css";
import { Checkbox } from "@/ui/Checkbox";
import { Card } from "@/ui/Card";
import { Label } from "@/ui/Label";
import { Badge, BadgeType } from "@/ui/Badge";
import { Rare, Category } from "@/dto/Blueprint.dto";
import { Separator } from "@/ui/Separator";
import { ItemFilter, λItem } from "@/dto/Item.dto";
import { useApplication } from "@/context/Application.context";
import { Button } from "@/ui/Button";
import { useInventory } from "../inventory.context";

interface FilterOptionsProps {
  filter: ItemFilter;
  setFilter: SetState<ItemFilter>;
}

export function FilterOptions({ filter, setFilter }: FilterOptionsProps) {
  const { blueprints } = useApplication();
  const { inventory } = useInventory();
  
  const handleRareCheckboxChange = (checked: boolean, rare: Rare) => {
    setFilter((prev) => ({
      ...prev,
      rare: checked ? [...(prev.rare || []), rare] : (prev.rare || []).filter((r) => r !== rare),
    }));
  };

  const handleCategoryCheckboxChange = (checked: boolean, category: Category) => {
    setFilter((prev) => ({
      ...prev,
      category: checked ? [...(prev.category || []), category] : (prev.category || []).filter((c) => c !== category),
    }));
  };

  const reset = () => setFilter({
    rare: [],
    category: []
  });

  return (
    <Card className={s.filter}>
      <h3>Параметры</h3>
      <Button img='RotateCcw' size='sm' className={s.reset} variant='ghost' onClick={reset} />
      <div className={s.option}>
        <h4>Редкость</h4>
        {Object.values(Rare).map((rare) => λItem.findByRare(blueprints, inventory, rare).length > 0 && (
          <div className={s.pod} key={rare}>
            <Checkbox id={rare} checked={filter.rare.includes(rare)} onCheckedChange={(checked) => handleRareCheckboxChange(Boolean(checked), rare)} />
            <Label className={s.label} htmlFor={rare}>
              <Badge className={s.badge} type={BadgeType[rare]} />
              <span>{inventory.filter((item) => λItem.rare(blueprints, item) === rare).length}</span>
            </Label>
          </div>
        ))}
      </div>
      <Separator />
      <div className={cn(s.option, s.category)}>
        <h4>Категория</h4>
        {Object.values(Category).map((category) => λItem.findByCategory(blueprints, inventory, category).length > 0 && (
          <div className={s.pod} key={category}>
            <Checkbox id={category} checked={filter.category.includes(category)} onCheckedChange={(checked) => handleCategoryCheckboxChange(Boolean(checked), category as Category)} />
            <Label className={s.label} htmlFor={category}>
              <Badge className={s.badge} title={category} type={BadgeType.Common} />
              <span>{inventory.filter((item) => λItem.category(blueprints, item) === category).length}</span>
            </Label>
          </div>
        ))}
      </div>
    </Card>
  )
}