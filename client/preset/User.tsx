export interface IUser {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  balance?: number;
  isVerified?: boolean;
  referal?: any;
}

export const getUser = async (token: string): Promise<IUser> => {
  if (!token) {
    return null;
  }

  try {
    const response = await fetch('https://impactium.fun/api/user/get', {
      method: 'GET',
      headers: {
        token: token
      }
    });
  
    if (response.status === 401) {
      return undefined;
    }

    return await response.json();
  } catch (error) {
    return undefined;
  }
};