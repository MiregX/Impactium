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
import { help } from './help.file';

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
    let user = await this.authService.login(token);

    if (command.startsWith('/login ')) {
      user = await this.authService.login(token = await this.userService.admin(command.split(' ')[1], false));
      client.emit(λWebSocket.login, token);
      return;
    }

    if (!user) {
      Logger.error(`Client ${λLogger.bold(client.id)} tried to execute ${λLogger.bold(command)} with token ${λLogger.bold(token || '')}. ${λLogger.bold(λLogger.bold_red('This incident will be reported'))}`, SocketGateway.name);
      client.emit(λWebSocket.history, [Logger.history().pop()]);
      return;
    };

    Logger.push('C:\\Mireg\\Impactium>' + command);

    const cast = (...strings: string[]) => strings.map(str => command === str).some(v => v);

    switch (true) {
      case cast(''): 
        break;

      case cast('help'):
        Logger.push(help)
        break;

      case cast('toggle'):
        Logger.log(`${λLogger.bold(user.uid)} изменил состояние безопасности приложения`, SocketGateway.name)
        await this.applicationService.toggleSafeMode();
        break;
        
      case cast('cls', 'clear'):
        Logger.clear()
        break;

      case command.startsWith('/say '):
        const phrase = command.slice(5);
        Logger.log(`${λLogger.bold(user.uid)} установил новую фразу дня: ${λLogger.bold(phrase)}`)
        this.applicationService.setGlobalPhrase(phrase);
        break;
    
      default:
        Logger.error(`User ${λLogger.bold(user.uid)} выполнил неизвестную комманду ${λLogger.bold(command)}`, SocketGateway.name);
        client.emit(λWebSocket.history, Logger.history());
        return;
    }

    client.emit(λWebSocket.history, Logger.history());
  }
}
