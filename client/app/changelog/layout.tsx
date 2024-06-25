import { ChangelogProvider } from "./context";

export default async function ChangelogLayout({ children }) {
  const log = await api('/changelog', {
    next: {
      revalidate: 1800
    }
  });

  return <ChangelogProvider prefetched={log} children={children} />;
}