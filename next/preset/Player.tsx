import { cookies } from 'next/headers';

interface IPlayerSkin {
  iconLink: string;
  charlink: string;
  originalTitle: string;
}

export interface IPlayer {
  nickname?: string;
  password?: string;
  skin?: IPlayerSkin;
  registered?: number;
  achievements?: any;
}

export const getPlayer = async (token: string): Promise<IPlayer> => {
  if (!token)
    return null;

  try {
    const response = await fetch('https://impactium.fun/api/player/get', {
      method: 'GET',
      headers: {
        'token': token
      }
    })

    if (!response.ok) {
      return undefined;
    }

    return await response.json();
  } catch (error) {
    return undefined;
  }
}