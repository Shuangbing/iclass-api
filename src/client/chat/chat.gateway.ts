import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('jion')
  jionGroup(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { groupId } = data
    client.join(groupId)
    return { status: "success", groupId: groupId };
  }


  @SubscribeMessage('send:message')
  sendMessageToGroup(@MessageBody() data, @ConnectedSocket() client: Socket) {
    let rooms = Object.keys(client.rooms);
    console.log(rooms)
    return { status: "success" };
  }


  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(client.handshake.query)
    console.log(`Client connected: ${client.id}`);
  }
}
