import { UUID } from "crypto";
import { AuthPayload, Payload, Token } from "./auth.entity";
import { UserEntity } from "@api/main/user/addon/user.entity";
import { Response, Request } from 'express'
import { λParam } from "@impactium/pattern";

export interface AuthMethodService {
  getUrl: (uuid?: UUID) => Promise<URL> | URL | Promise<string> | string ;
  callback: (code: string | UUID | Request | AuthPayload | any, uuid: string | UUID | any ) => Promise<Token> | Token | any
}

export interface AuthMethodController {
  getUrl: (
    income: Response,
    uid: λParam.Id | undefined,
  ) => Promise<{ url: string }> | { url: string };
  callback: (...args: any[]) => PromiseLike<void | { url: string } | Token>;
}