import { getServerLink } from "./master";
import type { FulfilledUser } from "@impactium/types";

export async function getUser(authorization: string): Promise<FulfilledUser> {
  if (!authorization) {
    return null;
  }

  try {
    const response = await fetch(`${getServerLink()}/api/user/get`, {
      cache: 'no-cache',
      method: 'GET',
      headers: {
        authorization: `Bearer ${authorization}`
      }
    });

    if (!response.ok) throw Error();

    return await response.json();
  } catch (_) {
    return undefined;
  }
};