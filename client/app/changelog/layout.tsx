import { _server } from "@/dto/master"
import { redirect } from "next/navigation";
import { ContextProvider } from "./context";

export default async function ChangelogLayout({ children }) {
  const log = await fetch(`${_server()}/api/changelog`, {
    method: 'GET',
    next: {
      revalidate: 1800
    }
  })
  .then(async response => await response.json())
  .catch(() => []);

  return <ContextProvider prefetched={log} children={children} />;
}