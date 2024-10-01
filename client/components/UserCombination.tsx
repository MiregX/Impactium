import { User, UserEntity } from "@/dto/User";
import { Combination, CombinationSkeleton } from "@/ui/Combitation";

interface UserCombinationProps {
  user: User | undefined | null
}

export function UserCombination({ user: _user }: UserCombinationProps) {
  if (!_user) return <CombinationSkeleton />;

  const user = new UserEntity(_user)

  return <Combination id={user.username} src={user.avatar} name={user.displayName} />
}
