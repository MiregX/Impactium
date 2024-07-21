import { Api } from "@/dto/api.dto";
import { λ } from "./λ.class";
import { ResponseBase } from "@/dto/Response.dto";
import { Configuration } from "@impactium/config";
import { parseApiOptions } from "@/lib/utils";
import { useToast } from "@/ui/Toaster";

export function _server(v?: boolean) {
  return Configuration.isProductionMode() || process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_HOST || 'https://impactium.fun'
    : v
      ? process.env.NUMERIC_HOST || 'https://impactium.fun'
      : process.env.SYMBOLIC_HOST || 'https://impactium.fun'
}

const api: Api = async function <T>(path: string, arg2?: any, arg3?: any): Promise<λ<ResponseBase<T>> | T | null> {
  const { options, callback } = parseApiOptions<T>(arg2, arg3);

  const response = await fetch(`${_server(options?.useNumericHost)}/api${path.startsWith('/') ? path : `/${path}`}`, {
    credentials: 'include',
    method: 'GET',
    cache: 'no-cache',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  }).catch(() => undefined);

  const res = new λ(!response
    ? undefined
    : await response.json()
  );

  const result = options?.raw
    ? res
    : res.isSuccess()
      ? res.data
      : null

  if (options.toast) {
    useToast(res.data.message, {}, res.isSuccess() && options.toast)
  }

  if (callback) {
    callback(result);
  }

  return result;
}

globalThis.api = api