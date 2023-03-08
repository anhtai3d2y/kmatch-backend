import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    console.log(message);
    this.server.emit('message', message);
  }

  @SubscribeMessage('events')
  handleEvent(client: Socket, data) {
    console.log('message: ', data.message);
    this.server.emit(data.emitId, data.message);
    return data;
  }

  @SubscribeMessage('matches')
  handleMatches(client: Socket, data) {
    this.server.emit(data.emitId, data.message);
    return data;
  }
}
