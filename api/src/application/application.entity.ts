type status = 0 | 200

export interface Info {
  status: status,
  environment: Environment,
  enforced_preloader: boolean
}

export interface Environment {
  loaded: boolean,
  path: string,
  mode: EnvironmentModes,
  message: string,
}

export type EnvironmentModes = 'development' | 'production';