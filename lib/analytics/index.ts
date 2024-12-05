import { MaybeArray } from "@impactium/types";
import { Utils } from "@impactium/utils";

export namespace Analytics {
  export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'OPTIONS' | 'DELETE' | 'TRACE' | 'CONNECT' | 'HEAD'

  export type Data = number | string | null | undefined | Record<string, any> | Data[] | BodyInit;

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
      return Utils.between(this.status, 500, 599)
    }
  }

  export function send(logs: MaybeArray<LogEntity>) {
    try {
      fetch('http://localhost:3002/api/v2/log', {
        method: 'POST',
        body: JSON.stringify(logs)
      })
    } catch (err) {
      console.error("Failed to send analytics package");
    }
  }
}
