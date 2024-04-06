import { debounce } from 'lodash';
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

let isLocalServerReachable: boolean = true;
const checkServerAvailability = debounce(async () => {
  try {
    const response = await Promise.race([
      fetch(`http://localhost:3001/api/application/info`, {
        cache: 'no-cache',
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 300),
      )
    ]) as Response;

    const data = await response.json();
    isLocalServerReachable = !!data.status;
  } catch (_) {
    isLocalServerReachable = false;
  } finally {
    return isLocalServerReachable;
  }
}, 300000);

export function getServerLink() {
  checkServerAvailability();
  return isLocalServerReachable || !Configuration.isProductionMode() 
    ? 'http://localhost:3001'
    : 'https://impactium.fun'
}

interface _ApplicationInfo {
  readonly isEnforcedPreloader: number | boolean | string | undefined
}

export type ApplicationInfo = _ApplicationInfo;
