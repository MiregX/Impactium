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

interface IPlayerRequest {
  path: string;
  headers: IPlayerRequestHeaders,
  body?: any
}

interface IPlayerRequestHeaders {
  token: string;
  nickname?: string;
  password?: string;
  achievement?: string;
}

export const setNickname = async ({ token, nickname }: IPlayerRequestHeaders): Promise<IPlayer> => {
  return await playerAPI({
    path: 'set/nickname',
    headers: {
      token,
      nickname
    }
  });
};

export const setPassword = async ({ token, password }: IPlayerRequestHeaders): Promise<IPlayer> => {
  return await playerAPI({
    path: 'set/password',
    headers: {
      token,
      password
    }
  });
};

export const setSkin = async ({ token, image }: { token: string, image: Blob }): Promise<IPlayer> => {
  const formData = new FormData();
  formData.append('image', image);

  return await playerAPI({
    path: 'set/skin',
    headers: {
      token
    },
    body: formData,
  });
};

export const register = async ({ token }: IPlayerRequestHeaders): Promise<IPlayer> => {
  return await playerAPI({
    path: 'register',
    headers: {
      token
    }
  });
};

export const getPlayer = async ({ token }: IPlayerRequestHeaders): Promise<IPlayer> => {
  return await playerAPI({
    path: 'get',
    headers: {
      token
    }
  });
};

export const getAchievements = async ({ token }: IPlayerRequestHeaders): Promise<IPlayer> => {
  return await playerAPI({
    path: 'get/achievements',
    headers: {
      token
    }
  });
};

export const setAchievement = async ({ token, achievement }: IPlayerRequestHeaders): Promise<IPlayer> => {
  return await playerAPI({
    path: 'set/achievement',
    headers: {
      token,
      achievement: achievement
    }
  });
};

const playerAPI = async ({ path, headers, body }: IPlayerRequest): Promise<IPlayer> => {
  try {
    if (!headers.token) return undefined;

    const method = path.startsWith('get')
      ? 'GET'
      : 'POST';

    const response = await fetch('https://impactium.fun/api/player/' + path, {
      method,
      headers: {
        ...headers
      },
      body
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    return undefined
  }
};