import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

interface GetDataRequest {
  id: string;
}

interface GetDataResponse {
  req_id: string;
  timestamp: number;
  status: number;
  data: any;
}

@Controller()
export class AnalyticsController {
  @GrpcMethod('AnalyticsService', 'GetData')
  getData(request: GetDataRequest) {
    return { data: `Received data for ID: ${request.id}` };
  }
}
