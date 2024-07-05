import { Children } from '@/dto/Children';
import { StatusProvider } from './context'
import { Status } from '@/dto/Status';

export default async function StatusLayout({ children }: Children) {
  const status = await api<Status[]>('/application/status');

  return <StatusProvider prefetched={status || []} children={children} />;
}
