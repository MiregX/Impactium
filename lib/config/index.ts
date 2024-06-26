export class Configuration {
  static processEnvVariables(): Record<string, string> {
    const processedEnv: Record<string, string> = {};

    for (const key in process.env) {
      const value = process.env[key];
      if (typeof value === 'string') {
        processedEnv[key] = value.replace(/\$\{(.+?)\}/g, (_, match) => {
          const replacement = process.env[match];
          return replacement !== undefined ? replacement : '';
        });
      }
    }

    return processedEnv;
  }

  static _server() {
    return this.isProductionMode()
      ? process.env.HOST
      : process.env.API_LOCALHOST
  }

  static getClientLink() {
    return this.isProductionMode()
      ? process.env.HOST
      : process.env.APP_LOCALHOST
  }

  static getLink() {
    return this.isProductionMode()
      ? process.env.HOST
      : process.env.LOCALHOST
  }

  static isEnvironmentLoaded(): boolean {
    return typeof process.env.X === 'string';
  }

  static isProductionMode(): boolean {
    return parseInt(process.env.X!) > 0
  }

  static getMode() {
    return this.isProductionMode()
      ? 'production'
      : 'development'
  }
}
