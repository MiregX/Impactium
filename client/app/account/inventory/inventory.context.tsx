'use client'
import { useState, createContext, useContext } from "react";
import { Item, λItem } from "@/dto/Item.dto";
import { useApplication } from "@/context/Application.context";

export interface InventoryContextProps {
  icons: Partial<Record<Item['imprint'], JSX.Element>>;
  inventory: Item[];
  setInventory: React.Dispatch<React.SetStateAction<Item[]>>;
  refreshInventory: (indent?: string) => void;
}

const InventoryContext = createContext<InventoryContextProps | undefined>(undefined);

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
    icons: InventoryContextProps['icons']
  }) => {
  const { blueprints } = useApplication();
  const [inventory, setInventory] = useState(λItem.sort(blueprints, prefetched));
  const [icons, setIcons] = useState(_icons);

  const refreshInventory = () => api<Item[]>(`/user/inventory`, setInventory);
  
  const props: InventoryContextProps = {
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