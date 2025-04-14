import { UUID } from "crypto";
import { AuthPayload, Token } from "./auth.entity";
import { Response, Request } from 'express'

export interface AuthMethodService {
  getUrl: (uuid?: UUID) => Promise<URL> | URL | Promise<string> | string;
  callback: (code: string | UUID | Request | AuthPayload | any, uuid: string | UUID | any) => Promise<Token> | Token | any
}

export interface AuthMethodController {
  getUrl: (
    income: Response,
    uid: string | undefined,
  ) => Promise<{ url: string }> | { url: string };
  callback: (...args: any[]) => PromiseLike<void | { url: string } | Token>;
}