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
import { Configuration } from '@impactium/config';
import { λLogger, λParam, λWebSocket } from '@impactium/pattern';
import { WebSocketEmitDefinitions, WebSocketOnDefinitions } from '@impactium/types';
import { AuthService } from '../auth/auth.service';
import { Logger } from '../application/addon/logger.service';
import { UserService } from '../user/user.service';
import { help } from './help.file';
import { Token } from '../auth/addon/auth.entity';

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
    token: Token | undefined,
    command: λParam.Command
  }, client: Socket<WebSocketOnDefinitions, WebSocketEmitDefinitions>) {
    let user = token ? this.authService.login(token) : null;

    const err = () => {
      Logger.error(`Client ${λLogger.bold(client.id)} попробовал выполнить неизвестную команду ${λLogger.bold(command)} с авторизацией ${λLogger.bold(token || '')}. ${λLogger.bold(λLogger.bold_red('Этот инцидент будет сохранён для анализа'))}`, SocketGateway.name);
      client.emit(λWebSocket.history, [Logger.history().pop()]);
    }

    if (command.startsWith('/login ')) {
      try {
        user = this.authService.login(token = (await this.userService.admin(command.split(' ')[1], false) as Token));
        client.emit(λWebSocket.login, token);
      } catch (_) {
        return err();
      }
    }

    if (!user) {
      return err();
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
        Logger.warn(`Пользователь ${λLogger.bold(user.uid)} выполнил неизвестную комманду ${λLogger.bold(command)}`, SocketGateway.name);
        client.emit(λWebSocket.history, Logger.history());
        return;
    }

    client.emit(λWebSocket.history, Logger.history());
  }
}
