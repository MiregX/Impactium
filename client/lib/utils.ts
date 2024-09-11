import { λ } from "@/decorator/λ.class";
import { RequestOptions } from "@/dto/api.dto"
import { ResponseBase } from "@/dto/Response.dto";
import { Callback } from "@impactium/types";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type unresolwedArgument<T> = RequestInit & RequestOptions & { raw?: boolean } | Callback<T> | undefined;

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

export function capitalize(str: string) {
  return str.substring(0, 1).toUpperCase() + str.substring(1)
}