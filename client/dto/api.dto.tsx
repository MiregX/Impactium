import { λ } from "@/decorator/λ.class";
import { ResponseBase } from "./Response.dto";
import { Callback } from '@impactium/types'
import { SetState } from "@/lib/utils";

export interface RequestOptions {
  useNumericHost?: boolean;
  toast?: string | boolean;
  setLoading?: SetState<boolean>;
};

type RawTrueOptions<T> = RequestInit & { raw: true } & RequestOptions;
type RawFalseOptions<T> = RequestInit & { raw?: false } & RequestOptions;
type AnyOptions<T> = RequestInit & { raw?: boolean } & RequestOptions;

export type Api = {
  /**
   * @param setLoading: SetState<boolean>
   * Ставит true в перед запросом и false после ответа
   * 
   * @param toast: keyof Locale | boolean
   * Используется при успешном запросе если string, или в случае boolean выводит сообщение об ошибке
  */
  <T>(path: string, options: RawTrueOptions<T>): Promise<λ<ResponseBase<T>>>;
  <T>(path: string, options?: RawFalseOptions<T>): Promise<T>;
  <T>(path: string, options?: AnyOptions<T>): Promise<λ<ResponseBase<T>> | T>;

  // Сигнатуры с callback
  <T>(path: string, options: RawTrueOptions<T>, callback: Callback<λ<ResponseBase<T>>>): Promise<λ<ResponseBase<T>>>;
  <T>(path: string, options?: RawFalseOptions<T>, callback?: Callback<T>): Promise<T>;
  <T>(path: string, options?: AnyOptions<T>, callback?: Callback<λ<ResponseBase<T>> | T>): Promise<λ<ResponseBase<T>> | T>;

  // Сигнатуры с callback как вторым аргументом
  <T>(path: string, callback: Callback<λ<ResponseBase<T>>>, options: RawTrueOptions<T>): Promise<λ<ResponseBase<T>>>;
  <T>(path: string, callback: Callback<T>, options?: RawFalseOptions<T>): Promise<T>;
  <T>(path: string, callback: Callback<λ<ResponseBase<T>> | T>, options?: AnyOptions<T>): Promise<λ<ResponseBase<T>> | T>;
};
