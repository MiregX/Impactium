import { between } from '@impactium/utils'
import { capitalize } from 'lodash';
import { toast } from 'sonner'

type Callback<T> = (data: T) => void;

interface ResponseBase<T = any> {
  status: number
  timestamp: Date
  req_id: string
  data: T
}

type ResponseSuccess<T = any> = ResponseBase<T>

type ResponseError = ResponseBase<{
  statusCode: number
  message: string
}>

export class λ<T extends ResponseBase<any>> {
  status: number;
  req_id: string
  timestamp: Date
  data: T['data']

  constructor(data?: T) {
    this.status = data?.status ?? 500;
    this.req_id = data?.req_id || ''
    this.timestamp = data?.timestamp || new Date()
    this.data = data
      ? data.data
      : ({
        message: 'internal_server_error',
        statusCode: 500,
      } as ResponseError['data'])
  }

  isError = (): this is ResponseError => between(this.status, 400, 599);

  isSuccess = (): this is λ<ResponseSuccess<T['data']>> => between(this.status, 200, 399);
}

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export interface RequestOptions {
  useNumericHost?: boolean
  toast?: string | boolean
  setLoading?: SetState<boolean>
  query?: Record<string, string | number | boolean>
  body?: Record<string, any> | RequestInit['body']
  deassign?: boolean
}

type RawTrueOptions = Omit<RequestInit, 'body'> & {
  raw: true
} & RequestOptions
type RawFalseOptions = Omit<RequestInit, 'body'> & {
  raw?: false
} & RequestOptions
type AnyOptions = Omit<RequestInit, 'body'> & {
  raw?: boolean
} & RequestOptions

export type Api = {
  /**
   * @param setLoading: SetState<boolean>
   * Ставит true в перед запросом и false после ответа
   *
   * @param toast: keyof Locale | boolean
   * Используется при успешном запросе если string, или в случае boolean выводит сообщение об ошибке
   */
  <T>(path: string, options: RawTrueOptions): Promise<λ<ResponseBase<T>>>
  <T>(path: string, options?: RawFalseOptions): Promise<T>
  <T>(path: string, options?: AnyOptions): Promise<λ<ResponseBase<T>> | T>

  <T>(
    path: string,
    options: RawTrueOptions,
    callback: Callback<λ<ResponseBase<T>>>,
  ): Promise<λ<ResponseBase<T>>>
  <T>(
    path: string,
    options?: RawFalseOptions,
    callback?: Callback<T>,
  ): Promise<T>
  <T>(
    path: string,
    options?: AnyOptions,
    callback?: Callback<λ<ResponseBase<T>> | T>,
  ): Promise<λ<ResponseBase<T>> | T>

  <T>(
    path: string,
    callback: Callback<λ<ResponseBase<T>>>,
    options: RawTrueOptions,
  ): Promise<λ<ResponseBase<T>>>
  <T>(
    path: string,
    callback: Callback<T>,
    options?: RawFalseOptions,
  ): Promise<T>
  <T>(
    path: string,
    callback: Callback<λ<ResponseBase<T>> | T>,
    options?: AnyOptions,
  ): Promise<λ<ResponseBase<T>> | T>
}

type unresolwedArgument<T> =
  | (RequestInit & RequestOptions & { raw?: boolean })
  | Callback<T>
  | undefined

export function parseApiOptions<T>(
  a: unresolwedArgument<T>,
  b: unresolwedArgument<T>,
  _path: string,
) {
  const options: RequestInit & RequestOptions & { raw?: boolean } = {}
  let callback: Callback<T> | Callback<Promise<T>> | undefined

  if (typeof a === 'function') {
    callback = a
    if (b && typeof b === 'object') {
      Object.assign(options, b)
    }
  } else if (typeof a === 'object') {
    Object.assign(options, a)
    if (b && typeof b === 'function') {
      callback = b
    }
  }

  const headers: Record<string, string> = {}

  if (!options.deassign) {
    headers['Content-Type'] = 'application/json'
  }

  options.headers = Object.assign(options.headers || {}, headers)

  if (typeof options.body === 'object' && !(options.body instanceof FormData)) {
    options.body = JSON.stringify(options.body, (_, v) =>
      typeof v === 'bigint' ? v.toString() : v,
    )
  }

  const path = _path.startsWith('/') ? _path : `/${_path}`

  const toStringObject = (obj: typeof options.query) =>
    obj
      ? Object.fromEntries(
        Object.entries(options.query || {}).map(([key, value]) => [
          key,
          String(value),
        ]),
      )
      : ''

  const query = new URLSearchParams(toStringObject(options.query))

  return {
    options,
    callback,
    query,
    path,
    endpoint: getServer() + '/api',
  }
}

export function getServer() {
  return process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_HOST || 'https://impactium.fun'
    : 'http://localhost'
}

export function soft<T>(value: T, func?: SetState<T>) {
  if (func) func((_: T) => value as T)
}

const api: Api = async function <T>(
  _path: string,
  arg2?: any,
  arg3?: any,
): Promise<λ<ResponseBase<T>> | T> {
  const { options, callback, query, path, endpoint } = parseApiOptions<T>(
    arg2,
    arg3,
    _path,
  )

  soft(true, options.setLoading)

  const response = await fetch(
    `${endpoint}${path}${query ? `?${query}` : ''}`,
    {
      ...options,
    },
  ).catch(() => undefined)

  let res: λ<any>;
  try {
    res = new λ(await response?.json());
  } catch (error) {
    console.log(error);
    res = new λ(undefined);
  }

  const isSuccess = res.isSuccess()

  const result = options.raw ? res : (isSuccess ? res.data : null)

  if (isSuccess) {
    if (typeof options.toast === 'string') {
      toast(options.toast)
    }
    if (callback) {
      await callback(result)
    }
  } else if (options.toast !== false && typeof toast.error === 'function') {
    toast.error(
      toSeparatedCase(res.data?.__error?.name),
      {
        description: res.data?.__error?.msg
          ? capitalize(res.data.__error.msg)
          : 'Check console for further information',
      },
    )
  }

  soft(false, options.setLoading)

  return result
}

const toSeparatedCase = (str: string): string => {
  if (!str) return 'Unknown Error'

  const withSpaces = str.replace(/([a-z])([A-Z])/g, '$1 $2')

  const words = withSpaces.split(/[\s_]+/)

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

globalThis.api = api
