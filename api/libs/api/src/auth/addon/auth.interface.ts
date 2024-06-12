import { UUID } from "crypto";
import { AuthResult } from "./auth.entity";
import { UserEntity } from "@api/main/user/addon/user.entity";
import { Response, Request } from 'express'

export interface AuthMethod {
  getUrl: (uuid?: UUID) => Promise<URL> | URL | Promise<string> | string ;
  callback: (code: string | UUID | Request, uuid: string | UUID ) => Promise<AuthResult> | AuthResult
}

export interface AuthController {
  getUrl: (
    income: Response,
    user: UserEntity | undefined,
  ) => Promise<{ url: string }> | { url: string };
  callback: (...args: any[]) => Promise<{ url: string }> | { url: string };
}