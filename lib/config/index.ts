export class Configuration {
  static processEnvVariables(): Record<string, string> {
    for (const key in process.env) {
      process.env[key] = process.env[key].replace(/\$\{(.+?)\}/g, (_, match) => process.env[match]);
    }
    return process.env;
  }

  static getServerLink() {
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
    return parseInt(process.env.X) > 0
  }

  static getMode() {
    return this.isProductionMode()
      ? 'production'
      : 'development'
  }
}
