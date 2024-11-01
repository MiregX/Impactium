// analytics.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';


// grpc-client.options.ts
import { ClientOptions, Transport } from '@nestjs/microservices';

export const GrpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'analytics',
    protoPath: '../controller.proto',
    url: 'localhost:3002',
  },
};


interface AnalyticsServiceClient {
  getData(data: {}): Observable<any>;
}

@Injectable()
export class AnalyticsService implements OnModuleInit {
  @Client(GrpcClientOptions)
  private client!: ClientGrpc;

  private analyticsService!: AnalyticsServiceClient;

  onModuleInit() {
    this.analyticsService = this.client.getService<AnalyticsServiceClient>('AnalyticsService');
    this.startPeriodicRequest();
  }

  private startPeriodicRequest() {
    setInterval(async () => {
      try {
        const response = await this.analyticsService.getData({}).toPromise();
        console.log('Получен ответ от Go сервера:', response);
      } catch (error) {
        console.error('Ошибка при отправке gRPC запроса:', error);
      }
    }, 2000);
  }
}
