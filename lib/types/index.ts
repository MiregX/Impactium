import { Console } from "@impactium/console";
import { λParam, λWebSocket } from "../pattern";

export type Callback<T> = (data: T) => void;

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
  history: Console.History[];
  globalPhrase?: string;
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
  isSafeMode: 1,
  history: []
}

export interface WebSocketEmitDefinitions {
  [λWebSocket.updateApplicationInfo]: any,
  [λWebSocket.history]: any,
  [λWebSocket.login]: any,
  [λWebSocket.globalPhrase]: any
}

export interface WebSocketOnDefinitions {
  [λWebSocket.updateApplicationInfo]: () => Promise<Application>,
  [λWebSocket.blueprints]: () => Promise<Array<{
    imprint: string;
    rare: any;
    category: any;
  }>>;
  [λWebSocket.command]: ({ token, command }: {
    token: `Bearer ${string}`;
    command: λParam.Command
  }) => void
}
