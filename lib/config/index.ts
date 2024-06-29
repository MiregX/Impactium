export class Configuration {
  static processEnvVariables() {
    for (const key in process.env) {
      process.env[key] = process.env[key]!.replace(/\$\{(.+?)\}/g, (_, match) => process.env[match]!);
    }
    return process.env;
  }

  static _server() {
    return this.isProductionMode()
      ? process.env.API_PRODUCTION_HOST
      : process.env.API_SYMBOLIC_HOST
  }

  static getClientLink() {
    return this.isProductionMode()
      ? process.env.APP_PRODUCTION_HOST
      : process.env.APP_SYMBOLIC_HOST
  }

  static getLink() {
    return this.isProductionMode()
      ? process.env.API_PRODUCTION_HOST
      : process.env.LOCALHOST
  }

  static isEnvironmentLoaded(): boolean {
    return typeof process.env.X === 'string';
  }

  static isProductionMode(): boolean {
    return this.λ() > 0
  }

  static λ() {
    return parseInt(process.env.X!);
  }

  static getMode() {
    return this.isProductionMode()
      ? 'production'
      : 'development'
  }
}
