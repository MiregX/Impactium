import { ReactNode } from "@/dto/ReactNode";
import { ChangelogProvider } from "./context";

export default async function ChangelogLayout({ children }: ReactNode) {
  const log = await api('/changelog', {
    next: {
      revalidate: 1800
    }
  });

  return <ChangelogProvider prefetched={log} children={children} />;
}