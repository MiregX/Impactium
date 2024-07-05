import { Children } from "@/dto/Children";
import { ChangelogProvider } from "./context";
import { Changelog } from "@/dto/Changelog";

export default async function ChangelogLayout({ children }: Children) {
  const log = await api<Changelog[]>('/changelog', {
    next: {
      revalidate: 1800
    }
  })

  return <ChangelogProvider prefetched={log || []} children={children} />;
}