import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ApplicationService } from '../application/application.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { λParam, λWebSocket } from '@impactium/types';
import { AuthService } from '../auth/auth.service';
import { Logger } from '../application/addon/logger.service';
import { UserService } from '../user/user.service';
import { help } from './help.file';

@Injectable()
@WebSocketGateway({
  path: '/api/ws',
  cors: {
    origin: process.env.NODE_ENV === 'production' ? 'https://impactium.fun' : 'http://localhost',
    methods: ['*'],
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => ApplicationService))
    private readonly applicationService: ApplicationService,
    private readonly authService: AuthService,
    private readonly userService: UserService,

  ) { }

  @WebSocketServer() server!: Server;

  afterInit(server: Server) { }

  async handleConnection(client: Socket) {
    client.on(λWebSocket.updateApplicationInfo, async () => {
      const application = await this.applicationService.info()
      client.emit(λWebSocket.updateApplicationInfo, application);
      return application;
    });

    client.on(λWebSocket.command, (args) => this.handleCommand(args, client));
  }

  handleDisconnect(client: Socket) { }

  async handleCommand({
    command
  }: {
    command: λParam.Command
  }, client: Socket) {
    Logger.push('C:\\Mireg\\Impactium>' + command);

    const cast = (...strings: string[]) => strings.map(str => command === str).some(v => v);

    switch (true) {
      case cast(''):
        break;

      case cast('help'):
        Logger.push(help)
        break;

      case cast('toggle'):
        await this.applicationService.toggleSafeMode();
        break;

      case cast('cls', 'clear'):
        Logger.clear()
        break;

      default:
        client.emit(λWebSocket.history, Logger.history());
        return;
    }

    client.emit(λWebSocket.history, Logger.history());
  }
}
