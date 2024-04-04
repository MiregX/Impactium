import { Injectable } from '@nestjs/common';
import { Environment, EnvironmentModes, Info } from './application.entity';

@Injectable()
export class ApplicationService {
  info(): Info | Promise<Info> {
    const info: Info = {
      status: 200,
      environment: this.getEnvironment(),
      enforced_preloader: !!process.env.ENFORCED_PRELOADER
    }
    return info
  }

  private getEnvironment(): Environment {
    return {
      loaded: this.isEnvironmentLoaded(),
      path: process.env.X_PATH,
      mode: this.getMode(),
      message: process.env.X_MESSAGE,
    }
  }

  isEnvironmentLoaded(): boolean {
    return typeof process.env.X === 'string';
  }

  isProductionMode(): boolean {
    return parseInt(process.env.X) > 0
  }

  getMode(): EnvironmentModes {
    return this.isProductionMode()
      ? 'production'
      : 'development'
  }

  getLink() {
    return this.isProductionMode()
      ? process.env.DOMAIN
      : process.env.API_LOCALHOST
  }

  getClientLink() {
    return this.isProductionMode()
      ? process.env.DOMAIN
      : process.env.APP_LOCALHOST
  }
}
