import { User, UserEntity } from "@/dto/User.dto";
import { Combination, CombinationSkeleton } from "@/ui/Combitation";
import { CombinationProps } from "@/ui/Combitation";

interface UserCombinationProps extends Omit<CombinationProps, 'id' | 'src' | 'name'> {
  user: User | undefined | null
}

export function UserCombination({ user: _user, ...props }: UserCombinationProps) {
  if (!_user) return <CombinationSkeleton {...props} />;

  const user = new UserEntity(_user)

  return <Combination id={user.username} src={user.avatar} name={user.displayName} {...props} />
}
