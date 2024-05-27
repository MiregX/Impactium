export interface Service {
  ping: number,
  info: any
}

export type ServiceList = 'redis' | 'telegram' | 'cockroachdb' | 'cdn' | 'client' | 'api' | 'mcs' | 'pterodactyl'

export interface Status {
  [key: string]: Service
}