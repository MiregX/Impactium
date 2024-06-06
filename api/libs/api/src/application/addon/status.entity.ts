export class StatusEntity {
  ping: number | boolean;
  info: StatusInfoEntity;
}

export enum StatusInfoEntityTypes {
  Memory = 'memory',
  Uptime = 'uptime',
}

export class RedisMemory {
  used: string;
  max: string;
}

export class TelegramUptime {
  percentage: number;
}

interface StatusInfoEntityBase {
  type: StatusInfoEntityTypes;
  version: string;
  os: string;
}

type StatusInfoEntityMap = {
  [StatusInfoEntityTypes.Memory]: { memory: RedisMemory };
  [StatusInfoEntityTypes.Uptime]: { uptime: TelegramUptime };
};

export type StatusInfoEntity = {
  [K in keyof StatusInfoEntityMap]: StatusInfoEntityBase & { type: K } & StatusInfoEntityMap[K];
}[keyof StatusInfoEntityMap];