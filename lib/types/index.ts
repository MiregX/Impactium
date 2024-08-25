export type Callback<T> = (data: T | null) => void;

export interface Application {
  status: number;
  environment: {
      loaded: boolean;
      mode: string;
      message: string;
  };
  localhost: string[];
  statistics: {
      users_count: number;
      teams_count: number;
      tournaments_count: number;
  };
  isSafeMode: 0 | 1;
}

export const ApplicationBase: Application = {
  status: 500,
  environment: {
    loaded: false,
    mode: 'Production',
    message: ''
  },
  localhost: [],
  statistics: {
    users_count: 0,
    teams_count: 0,
    tournaments_count: 0
  },
  isSafeMode: 1
}