import { Socket, io } from 'socket.io-client';

import { SocketEmitter } from './types/emitters';
import { SocketListener } from './types/listeners';

import { __SOCKET_URL__ } from '@/shared/config/environment';

export type SocketImplementation = Socket<SocketListener, SocketEmitter>;

class SocketService {
    private _socket: SocketImplementation | null = null;

    constructor(private _url: string) {}

    setup() {
        if (!this._socket || this._socket?.disconnected) {
            this._socket = io(this._url);
        }
    }

    disconnect() {
        if (this._socket && this._socket.connected) {
            this._socket.disconnect();
        }
    }

    get getSocket(): SocketImplementation {
        return this._socket as SocketImplementation;
    }
}

export const socketService = new SocketService(__SOCKET_URL__);