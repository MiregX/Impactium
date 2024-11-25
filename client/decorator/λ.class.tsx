import { UUID } from "crypto";
import { ResponseBase, ResponseError, ResponseSuccess } from "@/dto/Response.dto";
import { Utils } from "@impactium/utils";

export class λ<T extends ResponseBase<any>> {
  status: number;
  req_id: UUID;
  timestamp: Date;
  data: T['data'];

  constructor(data?: T) {
    this.status = data?.status || 500;
    this.req_id = data?.req_id || '' as UUID;
    this.timestamp = data?.timestamp || new Date();
    this.data = data ? data.data : {
      message: 'internal_server_error',
      statusCode: 500,
    } as ResponseError['data'];
  }
  
  isError(): this is ResponseError {
    return Utils.between(this.status, 300, 500);
  }

  isSuccess(): this is λ<ResponseSuccess<T['data']>> {
    return Utils.between(this.status, 200, 299);
  }
}
