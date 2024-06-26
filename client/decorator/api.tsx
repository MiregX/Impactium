export function _server(v?: boolean) {
  return process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_HOST || 'https://impactium.fun'
    : v
      ? process.env.NUMERIC_HOST || 'http://0.0.0.0:3001'
      : process.env.SYMBOLIC_HOST || 'http://localhost:3001'
}

globalThis.api = (path, options): Promise<Response> => path
  ? fetch(_server() + '/api' + path, {
    credentials: 'include',
    method: 'GET',
    ...options,
    }).then(res => options?.isRaw
      ? res
      : res.ok
        ? options?.isText
          ? res.text()
          : res.json()
        : null
    ).catch(_ => undefined)
  : fetch(path, {
    credentials: 'include',
    method: 'GET',
    ...options,
    }).then(res => options?.isRaw
      ? res
      : res.ok
        ? options?.isText
          ? res.text()
          : res.json()
        : null
    ).catch(_ => undefined);