import { debounce } from 'lodash';

export async function requestApplicationInfoFromServer() {
  try {
    const response = await fetch(`${getLink()}/api/application/info`, {
      cache: "force-cache",
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

let isLocalServerReacheble: boolean = true;
const checkServerAvailability = debounce(async () => {
  try {
    const response = await fetch('http://localhost:3001/api/application/info');
    const data = await response.json();
    isLocalServerReacheble = !!data.status;
  } catch (_) {
    isLocalServerReacheble = false;
  } finally {
    return isLocalServerReacheble;
  }
}, 1000);


export function getLink() {
  checkServerAvailability();
  return isLocalServerReacheble
    ? 'http://localhost:3001'
    : 'https://impactium.fun';
}

interface _ApplicationInfo {
  readonly isEnforcedPreloader: number | boolean | string | undefined
}

export type ApplicationInfo = _ApplicationInfo;
