import { λ } from "@/decorator/λ.class";
import { ResponseBase } from "./Response.dto";

export interface RequestOptions {
  useNumericHost?: boolean
};

export type Api = {
  <T>(path: string, options: RequestInit & { raw: true } & RequestOptions): Promise<λ<ResponseBase<T>>>;
  <T>(path: string, options?: RequestInit & { raw?: false } & RequestOptions): Promise<T | null>;
  <T>(path: string, options?: RequestInit & { raw?: boolean } & RequestOptions): Promise<λ<ResponseBase<T>> | T | null>;
};
