import { UUID } from "crypto";
import { AuthPayload, AuthResult } from "./auth.entity";
import { UserEntity } from "@api/main/user/addon/user.entity";
import { Response, Request } from 'express'

export interface AuthMethodService {
  getUrl: (uuid?: UUID) => Promise<URL> | URL | Promise<string> | string ;
  callback: (code: string | UUID | Request | AuthPayload | any, uuid: string | UUID | any ) => Promise<AuthResult> | AuthResult | any
}

export interface AuthMethodController {
  getUrl: (
    income: Response,
    user: UserEntity | undefined,
  ) => Promise<{ url: string }> | { url: string };
  callback: (...args: any[]) => PromiseLike<void | { url: string } | AuthResult>;
}