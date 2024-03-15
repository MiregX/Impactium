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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${process.env.DOMAIN || 'http://localhost:3000'}/api/user/get`, {
      method: 'GET',
      headers: {
        token: token
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (response.status === 401) {
      return undefined;
    }

    return await response.json();
  } catch (error) {
    return undefined;
  }
};