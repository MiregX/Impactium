export async function requestApplicationInfoFromServer() {
  try {
    const response = await fetch(`${_server()}/api/application/info`, {
      cache: 'no-cache'
    });
    return await response.json();
  } catch (_) {
    return {
      enforced_preloader: !!process.env.ENFORCED_PRELOADER
    }
  }
}

export function _server() {
  return process.env.NODE_ENV === 'production'
    ? 'https://impactium.fun'
    : 'http://0.0.0.0:3001'
}

interface _ApplicationInfo {
  readonly isEnforcedPreloader: number | boolean | string | undefined
}

export type ApplicationInfo = _ApplicationInfo;
