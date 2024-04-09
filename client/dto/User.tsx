import { getServerLink } from "./master";
import type { FulfilledUser } from "@impactium/types";
import Cookies from "universal-cookie";

export async function getUser(authorization?: string): Promise<FulfilledUser> {
  const _authorization = new Cookies().get('Authorization') || authorization;

  if (!_authorization)
    return null;

  try {
    const response = await fetch(`${getServerLink()}/api/user/get`, {
      cache: 'no-cache',
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) throw Error();

    return await response.json();
  } catch (_) {
    return undefined;
  }
};