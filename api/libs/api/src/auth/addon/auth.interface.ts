import { UUID } from "crypto";
import { AuthResult } from "./auth.entity";

export interface AuthMethod {
  getUrl: (uuid?: UUID) => Promise<URL> | URL | Promise<string> | string ;
  callback: (code: string | UUID | Request) => Promise<AuthResult> | AuthResult
}