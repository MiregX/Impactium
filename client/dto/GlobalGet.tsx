import { _server } from "./master";
globalThis.get = (path, options): Promise<Response> => path
  ? fetch(_server() + path, {
    credentials: 'include',
    ...options,
    }).then(res => options?.isRaw
      ? res
      : res.ok
        ? options?.isText
          ? res.text()
          : res.json()
        : null
    )
  : fetch(path, {
    credentials: 'include',
    ...options,
    }).then(res => options?.isRaw
      ? res
      : res.ok
        ? options?.isText
          ? res.text()
          : res.json()
        : null
    );