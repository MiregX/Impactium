export class Configuration {
  static processEnvVariables() {
    for (const key in process.env) {
      process.env[key] = process.env[key]!.replace(/\$\{(.+?)\}/g, (_, match) => process.env[match]!);
    }
    return process.env;
  }

  static _server() {
    return this.isProductionMode()
      ? process.env.DOMAIN
      : process.env.LOCALHOST
  }

  static getClientLink() {
    return this.isProductionMode()
      ? process.env.DOMAIN
      : process.env.LOCALHOST
  }

  static getLink() {
    return this.isProductionMode()
      ? process.env.DOMAIN
      : process.env.LOCALHOST
  }

  static isEnvironmentLoaded(): boolean {
    return typeof process.env.X === 'string';
  }

  static isProductionMode(): boolean {
    return this.λ() > 0 || process.env.NODE_ENV === 'production'
  }

  static λ() {
    return parseInt(process.env.X!);
  }

  static compareBehaviour = ([prod, dev]: [string, string]) => Configuration.isProductionMode() ? prod : dev;

  static getMode() {
    return this.isProductionMode()
      ? 'production'
      : 'development'
  }
}
