'use server'
import { Item } from "@/dto/Item.dto";
import { λCookie } from "@impactium/pattern";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { InventoryProvider } from "./inventory.context";
import { λUtils } from "@impactium/utils";
import path from "path";
import fs from 'fs';

export default async function InventoryLayout({ children }: { children: React.ReactNode }) {
  const cookie = cookies();

  const token = cookie.get(λCookie.Authorization)?.value;

  if (!token) {
    redirect('/');
  }

  const inventory = await api<Item[]>(`/user/inventory`, {
    headers: { token }
  });

  if (!inventory) {
    redirect('/');
  }

  const icons: Partial<Record<Item['imprint'], string>> = {};

  await Promise.all(inventory.map(async (item) => {
    const svg = await λUtils.image(`public/item/${item.imprint}.svg`, fs, path);
    icons[item.imprint] = svg;
  }));

  return (
    <InventoryProvider prefetched={inventory} icons={icons}>
      {children}
    </InventoryProvider>
  );
}
