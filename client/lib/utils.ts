import { RequestOptions } from "@/decorator/api";
import { Callback, SetState } from "@impactium/types";

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

  options.query = options.query || {};

  const query = options.query ? new URLSearchParams(Object.keys(options.query).map(k => [k, options.query![k].toString()])) : '';

  return {
    options,
    callback,
    query,
    path
  };
}

export function soft<T>(value: T, func?: SetState<T>) {
  if (func) func((_: T) => value as T);
}

export const copy = async (value: string) => {
try {
      await navigator.clipboard.writeText(value);
    } catch (_) {}
}
export const copyConstrucror = (value: string) => () => copy(value);
