import { λ } from "@/decorator/λ.class";
import { ResponseBase } from "./Response.dto";
import { Callback } from '@impactium/types'
import { SetState } from "@/lib/utils";

export interface RequestOptions {
  useNumericHost?: boolean;
  toast?: string | boolean;
  state?: SetState<boolean>;
};

type RawTrueOptions = RequestInit & { raw: true } & RequestOptions;
type RawFalseOptions = RequestInit & { raw?: false } & RequestOptions;
type AnyOptions = RequestInit & { raw?: boolean } & RequestOptions;

export type Api = {
  // Основные сигнатуры
  <T>(path: string, options: RawTrueOptions): Promise<λ<ResponseBase<T>>>;
  <T>(path: string, options?: RawFalseOptions): Promise<T | null>;
  <T>(path: string, options?: AnyOptions): Promise<λ<ResponseBase<T>> | T | null>;

  // Сигнатуры с callback
  <T>(path: string, options: RawTrueOptions, callback: Callback<λ<ResponseBase<T>>>): Promise<λ<ResponseBase<T>>>;
  <T>(path: string, options?: RawFalseOptions, callback?: Callback<T>): Promise<T | null>;
  <T>(path: string, options?: AnyOptions, callback?: Callback<λ<ResponseBase<T>> | T>): Promise<λ<ResponseBase<T>> | T | null>;

  // Сигнатуры с callback как вторым аргументом
  <T>(path: string, callback: Callback<λ<ResponseBase<T>>>, options: RawTrueOptions): Promise<λ<ResponseBase<T>>>;
  <T>(path: string, callback: Callback<T>, options?: RawFalseOptions): Promise<T | null>;
  <T>(path: string, callback: Callback<λ<ResponseBase<T>> | T>, options?: AnyOptions): Promise<λ<ResponseBase<T>> | T | null>;
};
