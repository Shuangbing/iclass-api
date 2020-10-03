import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GroupService } from 'src/group/group.service';

@WebSocketGateway()
export class ChatGateway {

  constructor(
    private readonly groupService: GroupService
  ) { }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('jion')
  async jionGroup(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { groupId } = data
    const group = await this.groupService.findByGroupId(groupId);
    if (group) {
      client.join(groupId)
      return { status: true, groupData: group };
    } else {
      return { status: false, message: "グループが見つかりません" }
    }
  }


  @SubscribeMessage('send:message')
  sendMessageToGroup(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const { groupId } = data
    if (Object.keys(client.rooms).includes(groupId)) {
      this.server.to(groupId).emit('recive:message', data)
      return { status: true, data: data };
    } else {
      return { status: false, message: "送信権限がありません" };
    }
  }


  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(client.handshake.query)
    console.log(`Client connected: ${client.id}`);
  }
}