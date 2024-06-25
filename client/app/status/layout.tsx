import { StatusProvider } from './context'

export default async function StatusLayout({ children }) {
  const status = await api('/application/status')

  return <StatusProvider prefetched={status} children={children} />;
}