import { _server } from "@/dto/master"
import { redirect } from "next/navigation";
import { ChangelogProvider } from "./context";

export default async function ChangelogLayout({ children }) {
  const log = await fetch('/api/changelog', {
    method: 'GET',
    next: {
      revalidate: 1800
    }
  });

  return <ChangelogProvider prefetched={log} children={children} />;
}