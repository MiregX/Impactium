import { Api } from "@/dto/api.dto";
import { λ } from "./λ.class";
import { ResponseBase } from "@/dto/Response.dto";
import { Configuration } from "@impactium/config";
import { parseApiOptions, soft } from '@/lib/utils';
import { useToast } from "@/ui/Toaster";
import { toArray } from "@impactium/utils";

export function _server(v?: boolean) {
  return Configuration.isProductionMode() || process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_HOST || 'https://impactium.fun'
    : "http://localhost"
}

const api: Api = async function <T>(_path: string, arg2?: any, arg3?: any): Promise<λ<ResponseBase<T>> | T> {
  const { options, callback, query, path, endpoint } = parseApiOptions<T>(arg2, arg3, _path);

  soft(true, options.setLoading);

  const response = await fetch(`${endpoint}/api${path}${query}`, {
    credentials: 'include',
    method: 'GET',
    cache: 'no-cache',
    ...options,
    headers: options.headers,
  }).catch(() => undefined);

  const res = new λ(!response
    ? undefined
    : await response.json()
  );

  const isSuccess = res.isSuccess()

  const result = options.raw
    ? res
    : isSuccess
      ? res.data
      : null

  if (isSuccess && typeof options.toast === 'string') {
    useToast('', {}, options.toast)
  } else if (options.toast) {
    toArray(res.data?.message).map(m => useToast(m, {}, options.toast))
  }

  if (isSuccess && callback) {
    await callback(result);
  }

  soft(false, options.setLoading);

  return result;
}

globalThis.api = api