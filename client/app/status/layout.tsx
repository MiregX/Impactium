import { Children } from '@/types';
import { Status, StatusProvider } from './context'

export default async function StatusLayout({ children }: Children) {
  const status = await api<Status[]>('/application/status');

  return <StatusProvider prefetched={status || []} children={children} />;
}
