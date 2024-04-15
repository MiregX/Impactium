import { getServerLink } from "@/dto/master";
import Cookies from "universal-cookie";

export async function getUser(_authorization?: string): Promise<any> {
  const authorization = new Cookies().get('Authorization') || _authorization;

  if (!authorization)
    return null;

  try {
    const response = await fetch(`${getServerLink()}/api/user/get`, {
      method: 'GET',
      credentials: 'include',
      headers: { authorization }
    });

    if (!response.ok) throw Error();

    return await response.json();
  } catch (_) {
    console.log(_)
    return undefined;
  }
};