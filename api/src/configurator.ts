import { EnvironmentKeyNotProvided } from "src/application/addon/error";
import { λthrow } from "@impactium/utils";

export class Configuration {
  static processEnvVariables() {
    for (const key in process.env) {
      process.env[key] = process.env[key]!.replace(/\$\{(.+?)\}/g, (_, match) => process.env[match]!);
    }
    return process.env;
  }

  static link = Configuration.isProductionMode()
    ? process.env.DOMAIN!
    : process.env.LOCALHOST!

  static ftp = typeof process.env.FTP !== 'undefined'
    ? JSON.parse(process.env.FTP)
    : λthrow(EnvironmentKeyNotProvided.new('FTP'))

  static redis = {
    PORT: typeof process.env.API_REDIS_PORT !== 'undefined' ? parseInt(process.env.API_REDIS_PORT) : λthrow(EnvironmentKeyNotProvided.new('redis.PORT')),
    HOST: process.env.API_REDIS_HOST || λthrow(EnvironmentKeyNotProvided.new('redis.HOST'))
  }

  static getLink() {
    return Configuration.isProductionMode()
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
