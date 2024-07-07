import { RequestOptions } from "@/dto/api.dto";
import { λ } from "./λ.class";
import { ResponseBase } from "@/dto/Response.dto";
import { Configuration } from "@impactium/config";

export function _server(v?: boolean) {
  return Configuration.isProductionMode()
    ? process.env.PRODUCTION_HOST || 'https://impactium.fun'
    : v
      ? process.env.NUMERIC_HOST || 'http://0.0.0.0:3001'
      : process.env.SYMBOLIC_HOST || 'http://localhost:3001'
}

async function api<T>(path: string, options?: RequestInit & { raw?: boolean } & RequestOptions): Promise<λ<ResponseBase<T>> | T> {
  const response = await fetch(`${_server(options?.useNumericHost)}/api${path.startsWith('/') ? path : '/' + path}`, {
    credentials: 'include',
    method: 'GET',
    ...options,
  }).catch(_ => undefined);

  const res = new λ(!response
    ? undefined
    : await response.json().catch(() => response.text().catch(() => console.log(response))))

  return options?.raw
    ? res
    : res.isSuccess()
      ? res.data
      : null
}

globalThis.api = api