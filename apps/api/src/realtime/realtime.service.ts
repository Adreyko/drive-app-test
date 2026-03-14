import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

export const FILES_UPDATED_EVENT = 'files:updated';
export const AUTHENTICATED_USERS_ROOM = 'users:authenticated';

@Injectable()
export class RealtimeService {
  private server: Server | null = null;

  bindServer(server: Server): void {
    this.server = server;
  }

  getUserRoom(userId: string): string {
    return `user:${userId}`;
  }

  emitFilesUpdatedToUsers(userIds: Iterable<string>): void {
    if (!this.server) {
      return;
    }

    const uniqueUserIds = new Set(userIds);

    for (const userId of uniqueUserIds) {
      this.server
        .to(this.getUserRoom(userId))
        .emit(FILES_UPDATED_EVENT, { refresh: true });
    }
  }

  emitFilesUpdatedToAllAuthenticatedUsers(): void {
    if (!this.server) {
      return;
    }

    this.server
      .to(AUTHENTICATED_USERS_ROOM)
      .emit(FILES_UPDATED_EVENT, { refresh: true });
  }
}
