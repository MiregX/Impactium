export async function requestApplicationInfoFromServer() {
  try {
    const response = await fetch('/api/application/info', {
      cache: "force-cache",
      next: {
        revalidate: 60 * 60 * 6 // 6 hours
      }
    });
    const info = await response.json()
    return info
  } catch (_) {
    return {
      isEnforcedPreloader: false
    }
  }
}

interface _ApplicationInfo {
  readonly isEnforcedPreloader: number | boolean | string | undefined
}

export type ApplicationInfo = _ApplicationInfo