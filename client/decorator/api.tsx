import { Api } from "@/dto/api.dto";
import { λ } from "./λ.class";
import { ResponseBase } from "@/dto/Response.dto";
import { Configuration } from "@impactium/config";
import { parseApiOptions, soft } from "@/lib/utils";
import { useToast } from "@/ui/Toaster";
import { λUtils } from "@impactium/utils";
import { λError } from "@impactium/pattern";

export function _server(v?: boolean) {
  return Configuration.isProductionMode() || process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_HOST || 'https://impactium.fun'
    : v
      ? process.env.NUMERIC_HOST || 'http://0.0.0.0:3001'
      : process.env.SYMBOLIC_HOST || 'http://localhost:3001'
}

const api: Api = async function <T>(path: string, arg2?: any, arg3?: any): Promise<λ<ResponseBase<T>> | T> {
  const { options, callback } = parseApiOptions<T>(arg2, arg3);

  soft(true, options.setLoading);

  const response = await fetch(`${_server(options?.useNumericHost)}/api${path.startsWith('/') ? path : `/${path}`}`, {
    credentials: 'include',
    method: 'GET',
    cache: 'no-cache',
    ...options,
    headers: options.headers
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

  if (options.toast) {
    λUtils.array(res.data?.message).map(m => useToast(m, {}, options.toast))
    if (isSuccess && typeof options.toast === 'string') {
      useToast('', {}, options.toast)
    }
  }

  if (isSuccess && callback) {
    await callback(result);
  }

  soft(false, options.setLoading);

  return result;
}

globalThis.api = api