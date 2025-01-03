import { _server } from "@/decorator/api";
import { RequestOptions } from "@/dto/api.dto"
import { Joinable } from "@/dto/Joinable.dto";
import { Team } from "@/dto/Team.dto";
import { User } from "@/dto/User.dto";
import locale, { Template } from "@/public/locale";
import { λCookie } from "@impactium/pattern";
import { Callback } from "@impactium/types";
import { toast } from "sonner";
import Cookies from "universal-cookie";

type unresolwedArgument<T> = RequestInit & RequestOptions & { raw?: boolean} | Callback<T> | undefined;

export function parseApiOptions<T>(a: unresolwedArgument<T>, b: unresolwedArgument<T>, _path: string) {
  let options: RequestInit & RequestOptions & { raw?: boolean } = {};
  let callback: Callback<T> | undefined;

  if (typeof a === 'function') {
    callback = a;
    if (b && typeof b === 'object') {
      options = b;
    }
  } else if (typeof a === 'object') {
    options = a;
    if (b && typeof b === 'function') {
      callback = b;
    }
  }

  if (typeof options.body === 'object' && !(options.body instanceof FormData)) {
    options.headers = {
      ...options.headers,
      'Content-Type': 'application/json'
    },
    options.body = JSON.stringify(options.body);
  }

  const path = _path.startsWith('/') ? _path : `/${_path}`;

  return {
    options,
    callback,
    query: options.query ? `?${new URLSearchParams(options.query)}` : '',
    path,
    endpoint: _server(options.useNumericHost)
  };
}

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export function soft<T>(value: T, func?: SetState<T>) {
  if (func) func((_: T) => value as T);
}

export const convertISOstringToValue = (date: string) => new Date(date).valueOf();

export const isUserAreTeamOwner = (user: User | null, team: Team) => user?.uid === team.ownerId;

export const isUserAreTeamMember = (user: User | null, team: Team) => team.members?.some(member => user?.uid === member.uid);

export const isUserCanJoinTeam = (team: Team) => team.joinable === Joinable.Free

export const isUserAdmin = (user: User | null) => user?.uid === 'system';

export const copy = (value: string) => {
  const cookie = new Cookies();

  const key: keyof Template = cookie.get(λCookie.language) || 'us';

  navigator.clipboard.writeText(value);
  toast(locale.copied.title[key], {
    description: locale.copied.description[key]
  })
}
export const λcopy = (value: string) => () => copy(value);
