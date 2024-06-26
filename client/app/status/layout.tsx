import { ReactNode } from '@/dto/ReactNode';
import { StatusProvider } from './context'

export default async function StatusLayout({ children }: ReactNode) {
  const status = await api('/application/status')

  return <StatusProvider prefetched={status} children={children} />;
}