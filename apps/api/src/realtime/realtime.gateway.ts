import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { type JwtPayload } from '../auth/interfaces/auth.types';
import { UsersService } from '../users/users.service';
import {
  AUTHENTICATED_USERS_ROOM,
  RealtimeService,
} from './realtime.service';

type SocketUser = {
  id: string;
  email: string;
};

type AuthenticatedSocket = Socket & {
  data: {
    user: SocketUser;
  };
};

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class RealtimeGateway
  implements OnGatewayInit<Server>, OnGatewayConnection<AuthenticatedSocket>
{
  private readonly logger = new Logger(RealtimeGateway.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly realtimeService: RealtimeService,
    private readonly usersService: UsersService,
  ) {}

  afterInit(server: Server): void {
    this.realtimeService.bindServer(server);

    server.use((client, next) => {
      void this.authenticateSocket(client)
        .then((user) => {
          client.data.user = user;
          next();
        })
        .catch((error: unknown) => {
          next(new Error(this.getAuthorizationErrorMessage(error)));
        });
    });
  }

  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    const user: SocketUser = client.data.user;

    await client.join(this.realtimeService.getUserRoom(user.id));
    await client.join(AUTHENTICATED_USERS_ROOM);

    this.logger.debug(`Socket connected for user ${user.id}`);
  }

  private async authenticateSocket(client: Socket): Promise<SocketUser> {
    const token = this.extractToken(client);

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
    });
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return {
      id: user.id,
      email: user.email,
    };
  }

  private extractToken(client: Socket): string | null {
    const authToken = client.handshake.auth?.token;

    if (typeof authToken === 'string' && authToken.trim().length > 0) {
      return this.stripBearerPrefix(authToken);
    }

    const authorizationHeader = client.handshake.headers.authorization;

    if (
      typeof authorizationHeader === 'string' &&
      authorizationHeader.trim().length > 0
    ) {
      return this.stripBearerPrefix(authorizationHeader);
    }

    return null;
  }

  private stripBearerPrefix(value: string): string {
    return value.startsWith('Bearer ') ? value.slice(7) : value;
  }

  private getAuthorizationErrorMessage(error: unknown): string {
    if (error instanceof UnauthorizedException) {
      return 'Unauthorized';
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'Unauthorized';
  }
}
