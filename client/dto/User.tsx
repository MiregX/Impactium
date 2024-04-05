import { getServerLink } from "./master";

export interface IUser {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  balance?: number;
  isVerified?: boolean;
  referal?: any;
}

export const getUser = async (token: string) => {
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${getServerLink()}/api/user/get`, {
      cache: 'no-cache',
      method: 'GET',
    });

    console.log(response);

    return await response.json();
  } catch (_) {
    return undefined;
  }
};