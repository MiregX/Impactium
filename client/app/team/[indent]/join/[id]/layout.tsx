import { Children } from "@/types";
import { TeamJoinProvider } from "./join.context";

interface TeamJoinLayout extends Children {
  params: {
    id: string
  }
}

export default async function TeamJoinLayout ({ params, children }: TeamJoinLayout) {
  return (
    <TeamJoinProvider id={params.id}>
      {children}
    </TeamJoinProvider>
  )
}
