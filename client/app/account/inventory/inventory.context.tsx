'use client'
import { useState, createContext, useContext } from "react";
import { Item } from "@/dto/Item.dto";

interface InventoryContext {
  icons: Partial<Record<Item['imprint'], string>>;
  inventory: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
  refreshInventory: (indent?: string) => void;
}

const InventoryContext = createContext<InventoryContext | undefined>(undefined);

export const useInventory = () => {
  return useContext(InventoryContext) || (() => { throw new Error('Обнаружена попытка использовать InventoryContext вне области досягаемости') })();
};

export const InventoryProvider = ({
    children,
    prefetched,
    icons: _icons
  }: {
    children: React.ReactNode,
    prefetched: Item[],
    icons: Partial<Record<Item['imprint'], string>>
  }) => {
  const [inventory, setInventory] = useState(prefetched);
  const [icons, setIcons] = useState(_icons);

  const refreshInventory = () => api<Item[]>(`/user/inventory`, setInventory);
  
  const props: InventoryContext = {
    icons,
    inventory,
    setInventory,
    refreshInventory
  };
  return (
    <InventoryContext.Provider value={props}>
      {children}
    </InventoryContext.Provider>
  );
};