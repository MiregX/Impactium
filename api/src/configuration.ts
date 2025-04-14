
export class Configuration {
  static processEnvVariables(): Record<string, string> {
    for (const key in process.env) {
      process.env[key] = process.env[key]!.replace(/\$\{(.+?)\}/g, (_, match) => process.env[match]!);
    }
    return process.env as Record<string, string>;
  }

  static link() {
    return this.isProductionMode()
      ? process.env.DOMAIN!
      : process.env.LOCALHOST!
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
