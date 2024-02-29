import cookie from "@/context/Cookie";

export interface IUser {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  balance?: number;
  isVerified?: boolean;
  referal?: any; 
}

export const getUser = async (): Promise<IUser> => {
  const token: string | false = cookie.get('token') || false;

  if (!token)
    return null;

  try {
    const response = await fetch('https://impactium.fun/api/user/get', {
      method: 'GET',
      headers: {
        token: token
      },
      cache: 'no-store'
    });
  

    if (!response.ok)
       return null;

    return await response.json();
  } catch (error) {
    return null;
  }
};