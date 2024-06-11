import { HttpException, HttpStatus } from "@nestjs/common";

export class EnvironmentKeyNotProvided extends Error {
  constructor(key: string) {
    super(`Ключ ${key} не был передан в .env файле. Проверь его ещё раз`);
  }
}