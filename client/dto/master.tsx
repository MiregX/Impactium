export function _server(v?: boolean) {
  return process.env.NODE_ENV === 'production'
    ? 'https://impactium.fun'
    : v ? 'http://0.0.0.0:3001' : 'http://localhost:3001'
}

interface _ApplicationInfo {
  readonly isEnforcedPreloader: number | boolean | string | undefined
}

export type ApplicationInfo = _ApplicationInfo;
