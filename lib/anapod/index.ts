import { Fetch as FetchFunc } from "./functions/fetch";
import { Count as CountFunc } from "./functions/count";

export namespace Anapod {
  const SafetyCallFunction = <T extends (...args: any[]) => any>(func: T): T => {
    return ((...args: Parameters<T>): ReturnType<T> | void => {
      if (Internal.initialized) {
        return func(...args);
      } else {
        console.warn(`Cannot execute ${func.name} because Anapod.Client is not initialized. Please call Anapod.Initialize({...settings}) first.`);
        Internal.__stack.push({ func, args });
      }
    }) as T;
  };

  export const Fetch = SafetyCallFunction(FetchFunc.Fetch);
  export const Count = SafetyCallFunction(CountFunc);

  export type Method =
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "OPTIONS"
    | "DELETE"
    | "TRACE"
    | "CONNECT"
    | "HEAD";

  export type Data =
    | number
    | string
    | null
    | undefined
    | Record<string, any>
    | Data[]
    | BodyInit;

  export type RequestID = `${string}-${string}-${string}-${string}-${string}`;

  export interface Log {
    timestamp: number;
    method: Method;
    req_id: RequestID;
    status: number;
    path: string;
    data?: Data;
    took?: number;
  }

  export function WS() {
    return new WebSocket(`ws://localhost${Internal.url}/ws`);
  }

  export namespace Internal {
    export let initialized: boolean = false;
    export let url: string = "";
    export let defaultLimit: number = 15;
    export const __stack: Array<{ func: Function; args: any[] }> = [];
  }

  export namespace Initialize {
    export type Params = Omit<typeof Internal, "initialized" | "__stack">;
  }

  export function Initialize(params: Initialize.Params) {
    if (Internal.initialized) {
      return console.warn("Application has already been initialized");
    }

    Object.assign(Internal, params);
    Internal.initialized = true;

    // Execute pending stack calls
    Internal.__stack.forEach(({ func, args }) => {
      func(...args);
    });
    Internal.__stack.length = 0;
  }
}
