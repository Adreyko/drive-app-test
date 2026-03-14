'use client';

import { io, type Socket } from 'socket.io-client';

const socketServerUrl =
  process.env.NEXT_PUBLIC_SOCKET_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:3001';

export function createSocketClient(token: string): Socket {
  return io(socketServerUrl, {
    auth: {
      token,
    },
    transports: ['websocket'],
  });
}
