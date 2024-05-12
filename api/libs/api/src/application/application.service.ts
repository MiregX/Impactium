import { Injectable } from '@nestjs/common';
import type { Environment, Info } from './addon/application.entity';
import { Configuration } from '@impactium/config';

@Injectable()
export class ApplicationService {
  info(): Info | Promise<Info> {
    const info: Info = {
      status: 200,
      environment: this.getEnvironment(),
      enforced_preloader: !!process.env.ENFORCED_PRELOADER,
      localhost: process.env.API_LOCALHOST
    }
    return info
  }

  private getEnvironment(): Environment {
    return {
      loaded: Configuration.isEnvironmentLoaded(),
      path: process.env.X_PATH,
      mode: Configuration.getMode(),
      message: process.env.X_MESSAGE,
    }
  }
}
