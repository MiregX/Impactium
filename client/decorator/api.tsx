import { λ } from "./λ.class";
import { ResponseBase } from "@/dto/Response.dto";

export function _server(v?: boolean) {
  return process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_HOST || 'https://impactium.fun'
    : v
      ? process.env.NUMERIC_HOST || 'http://0.0.0.0:3001'
      : process.env.SYMBOLIC_HOST || 'http://localhost:3001'
}

function api<T>(path: string, options: RequestInit & { raw: true }): Promise<λ<ResponseBase<T>>>;
function api<T>(path: string, options?: RequestInit & { raw?: false }): Promise<T | null>;
function api<T>(path: string, options?: RequestInit & { raw?: boolean }): Promise<λ<ResponseBase<T>> | T | null>;

async function api<T>(path: string, options?: RequestInit & { raw?: boolean }): Promise<λ<ResponseBase<T>> | T> {
  const response = await fetch(`${_server()}/api${path.startsWith('/') ? path : '/' + path}`, {
    credentials: 'include',
    method: 'GET',
    ...options,
  }).catch(_ => undefined);

  const res = new λ(!response
    ? undefined
    : await response.json().catch(_ => {console.log(_); response.text()}))

  return options?.raw
    ? res
    : res.isSuccess()
      ? res.data
      : null
}

globalThis.api = api