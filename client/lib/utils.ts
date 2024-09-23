import { λ } from "@/decorator/λ.class";
import { RequestOptions } from "@/dto/api.dto"
import { ResponseBase } from "@/dto/Response.dto";
import { Team } from "@/dto/Team";
import { Tournament } from "@/dto/Tournament";
import { User } from "@/dto/User";
import { Callback } from "@impactium/types";
import { type ClassValue, clsx } from "clsx"
import { icons } from "lucide-react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type unresolwedArgument<T> = RequestInit & RequestOptions & { raw?: boolean} | Callback<T> | undefined;

export function parseApiOptions<T>(a: unresolwedArgument<T>, b: unresolwedArgument<T>) {
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

  return { options, callback };
}

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export function soft<T>(value: T, func?: SetState<T>) {
  if (func) func((_: T) => value as T);
}

export type λIcon = keyof typeof icons;

export const convertISOstringToValue = (date: string) => new Date(date).valueOf();

export const isUserAreTeamOwner = (user: User | null, team: Team) => user?.uid === team.ownerId;

export const isUserAreTeamMember = (user: User | null, team: Team) => team.members?.some(member => user?.uid === member.uid);

export const isUserCanJoinTeam = (team: Team) => team.members && team.members.length <= 7

export const isUserAdmin = (user: User | null) => user?.uid === 'system';