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

export const getUser = async (token?: string): Promise<IUser> => {
  token = token || cookie.get('token');
  console.log(cookie.get('token'))
  if (!token)
    return null;

  try {
    const response = await fetch('https://impactium.fun/api/user/get', {
      method: 'GET',
      headers: {
        token: token
      }
    });
  
    if (!response.ok) {
      cookie.remove('token');
      return undefined;
    }

    return await response.json();
  } catch (error) {
    cookie.remove('token');
    return undefined;
  }
};