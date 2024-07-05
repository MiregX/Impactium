import { λ } from "@/decorator/λ.class";
import { ResponseBase } from "./Response.dto";

export type Api = {
  <T>(path: string, options: RequestInit & { raw: true }): Promise<λ<ResponseBase<T>>>;
  <T>(path: string, options?: RequestInit & { raw?: false }): Promise<T | null>;
  <T>(path: string, options?: RequestInit & { raw?: boolean }): Promise<λ<ResponseBase<T>> | T | null>;
};