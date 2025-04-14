import { UUID } from "crypto";
<<<<<<< Updated upstream:api/libs/api/src/auth/addon/auth.interface.ts
import { AuthPayload, Token } from "./auth.entity";
import { Response, Request } from 'express'
=======
import { AuthPayload, Payload, Token } from "./auth.entity";
import { UserEntity } from "src/user/addon/user.entity";
import { Response, Request } from 'express'
import { λParam } from "@impactium/types";
>>>>>>> Stashed changes:api/src/auth/addon/auth.interface.ts

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