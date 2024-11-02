import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ApplicationService } from '../application/application.service';
import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Configuration } from '@impactium/config';
import { λLogger, λParam, λWebSocket } from '@impactium/pattern';
import { History, WebSocketEmitDefinitions, WebSocketOnDefinitions } from '@impactium/types';
import { λthrow } from '@impactium/utils';
import { AuthService } from '../auth/auth.service';
import { Logger } from '../application/addon/logger.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/addon/user.entity';

@Injectable()
@WebSocketGateway({
  path: '/api/ws',
  cors: {
    origin: Configuration.isProductionMode() ? 'https://impactium.fun' : 'http://localhost:3000',
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
    
  ) {}

  @WebSocketServer() server!: Server<WebSocketOnDefinitions, WebSocketEmitDefinitions>;

  afterInit(server: Server) {}

  async handleConnection(client: Socket<WebSocketOnDefinitions, WebSocketEmitDefinitions>) {
    client.on(λWebSocket.updateApplicationInfo, async () => {
    const application = await this.applicationService.info()
      client.emit(λWebSocket.updateApplicationInfo, application);
      return application;
    });

    client.on(λWebSocket.blueprints, async () => await this.applicationService.getBlueprints());

    client.on(λWebSocket.command, (args) => this.handleCommand(args, client));
  }

  handleDisconnect(client: Socket) {}

  async handleCommand({
    token,
    command
  }: {
    token: string | undefined,
    command: λParam.Command
  }, client: Socket<WebSocketOnDefinitions, WebSocketEmitDefinitions>) {
    let user: UserEntity | null | undefined;
    if (token) {
      user = await this.authService.login(token);
    } else if (command.startsWith('/login')) {
      token = await this.userService.admin(command.split(' ')[1], false);
      user = await this.authService.login(token);
    }

    if (!user) {
      Logger.error(`Client ${λLogger.bold(client.id)} tried to execute ${λLogger.bold(command)} with token ${λLogger.bold(token || '')}. ${λLogger.bold(λLogger.bold_red('This incident will be reported'))}`, SocketGateway.name);
      client.emit(λWebSocket.history, [Logger.history().pop()]);
      return;
    };

    switch (true) {
      case command === 'history': 
        break;

      case command.startsWith('/login'):
        client.emit(λWebSocket.login, token);
        break;
    
      default:
        Logger.error(`User ${λLogger.bold(user!.uid)} has executed unknown command ${λLogger.bold(command)}`, SocketGateway.name);
        client.emit(λWebSocket.history, Logger.history());
        return;
    }    

    Logger.log(`User ${λLogger.bold(user!.uid)} has executed command ${λLogger.bold(command)}`, SocketGateway.name)
    client.emit(λWebSocket.history, Logger.history());
  }
}
