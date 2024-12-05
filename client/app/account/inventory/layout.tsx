'use server'
import { Item } from '@/dto/Item.dto';
import { λCookie } from '@impactium/pattern';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { InventoryContextProps, InventoryProvider } from './inventory.context';

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

  const icons: InventoryContextProps['icons'] = {};

  await Promise.all(inventory.map(async (item) => {
    // icons[item.imprint] = <Image priority src={Utils.ui(`item/${item.imprint}.png`)} alt={item.imprint} width={128} height={128} />;
  }));

  return (
    <InventoryProvider prefetched={inventory} icons={icons}>
      {children}
    </InventoryProvider>
  );
}
