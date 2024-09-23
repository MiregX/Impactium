import { λ } from "@/decorator/λ.class";
import { ResponseBase } from "./Response.dto";
import { Callback } from '@impactium/types'
import { SetState } from "@/lib/utils";

export interface RequestOptions<T = any> {
  useNumericHost?: boolean;
  toast?: string | boolean;
  state?: SetState<T | null>;
};

type RawTrueOptions<T> = RequestInit & { raw: true } & RequestOptions<T>;
type RawFalseOptions<T> = RequestInit & { raw?: false } & RequestOptions<T>;
type AnyOptions<T> = RequestInit & { raw?: boolean } & RequestOptions<T>;

export type Api = {
  // Основные сигнатуры
  <T>(path: string, options: RawTrueOptions<T>): Promise<λ<ResponseBase<T>>>;
  <T>(path: string, options?: RawFalseOptions<T>): Promise<T | null>;
  <T>(path: string, options?: AnyOptions<T>): Promise<λ<ResponseBase<T>> | T | null>;

  // Сигнатуры с callback
  <T>(path: string, options: RawTrueOptions<T>, callback: Callback<λ<ResponseBase<T>>>): Promise<λ<ResponseBase<T>>>;
  <T>(path: string, options?: RawFalseOptions<T>, callback?: Callback<T>): Promise<T | null>;
  <T>(path: string, options?: AnyOptions<T>, callback?: Callback<λ<ResponseBase<T>> | T>): Promise<λ<ResponseBase<T>> | T | null>;

  // Сигнатуры с callback как вторым аргументом
  <T>(path: string, callback: Callback<λ<ResponseBase<T>>>, options: RawTrueOptions<T>): Promise<λ<ResponseBase<T>>>;
  <T>(path: string, callback: Callback<T>, options?: RawFalseOptions<T>): Promise<T | null>;
  <T>(path: string, callback: Callback<λ<ResponseBase<T>> | T>, options?: AnyOptions<T>): Promise<λ<ResponseBase<T>> | T | null>;
};
