import cookie from "./Cookie";

export interface IUser {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  balance?: number;
  isVerified?: boolean;
  referal?: any; 
}

export let user: IUser | null = null;
export const getUser = async (): Promise<IUser> => {
  const token: string | false = cookie.get('token') || false;

  if (!token)
    return user = null;

  try {
    console.log(token)
    const response = await fetch('https://impactium.fun/api/user/get', {
      method: 'GET',
      headers: {
        'token': token
      }
    });
    user = await response.json();
    return user;
  } catch (error) {
    console.log(error)
    throw new Error('Error during user data fetch');
  }
};

export function setToken(token: string | false) {
  if (token)
    cookie.set('token', token);
  else
    cookie.remove('token');
}
