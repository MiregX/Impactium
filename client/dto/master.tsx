import { Configuration } from '@impactium/config';

export async function requestApplicationInfoFromServer() {
  try {
    const response = await fetch(`${getServerLink()}/api/application/info`, {
      next: {
        revalidate: 60 * 60 * 6
      }
    });
    return await response.json();
  } catch (_) {
    return {
      enforced_preloader: !!process.env.ENFORCED_PRELOADER
    }
  }
}

export function getServerLink() {
  return Configuration.isProductionMode()
    ? 'https://impactium.fun'
    : 'http://localhost:3001'
}

interface _ApplicationInfo {
  readonly isEnforcedPreloader: number | boolean | string | undefined
}

export type ApplicationInfo = _ApplicationInfo;
