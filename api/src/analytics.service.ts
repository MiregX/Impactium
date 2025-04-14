import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'src/application/addon/logger.service';

interface AnalyticsServiceClient {
  getData(data: any): Observable<any>;
}

@Injectable()
export class AnalyticsService implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'analytics',
      protoPath: '../controller.proto',
      url: 'localhost:3002',
    },
  })
  private client!: ClientGrpc;

  private analyticsService!: AnalyticsServiceClient;

  onModuleInit() {
    this.analyticsService = this.client.getService<AnalyticsServiceClient>('AnalyticsService');
    this.request();
  }

  private request() {
    try {
      const observer = this.analyticsService.getData({});
      // observer.subscribe(this.parse)
    } catch (error) {
      Logger.error(error, 'Analytics')
    }
  }

  private parse = <T = any>(res: T) => {
    console.log(res);
  }
}
