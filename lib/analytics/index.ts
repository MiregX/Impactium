import { MaybeArray } from "@impactium/types";
import { between } from "@impactium/utils";

export namespace Analytics {
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

  export type Logs = Log[];

  export class LogEntity implements Analytics.Log {
    timestamp: number;
    method: Method;
    req_id: RequestID;
    status: number;
    path: string;
    data?: Data;
    took?: number;

    constructor(log: Log) {
      this.timestamp = log.timestamp;
      this.method = log.method;
      this.req_id = log.req_id;
      this.status = log.status;
      this.path = log.path;
      if (log.data) this.data = log.data;
      if (log.took) this.took = log.took;
    }

    create = () => JSON.stringify(this);

    send = () => send(this);

    isFatal() {
      return between(this.status, 500, 599);
    }
  }

  export function send(logs: MaybeArray<LogEntity>) {
    try {
      fetch("http://localhost:3002/api/v2/log", {
        method: "POST",
        body: JSON.stringify(logs),
      });
    } catch (err) {
      console.error("Failed to send analytics package");
    }
  }

  export namespace Fetch {
    export interface Params {
      filter?: string;
      skip?: number;
      limit?: number;
    }
  }

  export async function Fetch({
    filter,
    skip,
    limit = 50,
  }: Fetch.Params = {}): Promise<Analytics.Logs> {
    try {
      const response = await fetch(
        `/v2/logs?limit=${limit}&skip=${filter ? 0 : skip}&filter=${filter}`
      );

      if (!response.ok) {
        return [];
      }

      const { data } = await response.json();

      return data;
    } catch (error) {
      return [];
    }
  }

  export function Count(filter: string = ""): Promise<number> | number {
    const params = new URLSearchParams({ filter });

    try {
      const amount = fetch(`/api/v2/logs/count?${params}`, {
        method: "GET",
      }).then(async (res) => {
        const body = await res.json();

        return body.data;
      });

      return amount;
    } catch (err) {
      return 0;
    }
  }

  export function WS() {
    return new WebSocket("ws://localhost/api/v2/ws");
  }

  export namespace Internal {
    export let initialized: boolean = false;
    export let url: string = "";
    export const __stack: [Function, ...any][] = [];
  }

  export namespace Initialize {
    export type Params = Omit<typeof Internal, "initialized">;
  }

  function SafetyCallFunction(func: keyof typeof Analytics, ...props: any[]) {

  }

  export function Initialize(params: Initialize.Params) {
    Object.assign(Internal, params);
    Internal.initialized = true;
    unstack();
  }

  function unstack() {
    Analytics.Internal.__stack.forEach(([func, ...props]) => {
      func(...props);
    });
    Analytics.Internal.__stack.length = 0;
  }
}
