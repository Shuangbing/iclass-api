import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GroupService } from 'src/group/group.service';
import { ClientService } from '../client.service';

@WebSocketGateway()
export class ChatGateway {

  constructor(
    private readonly groupService: GroupService,
    private readonly clientService: ClientService,
  ) { }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('jion')
  async jionGroup(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const clientAccessToken = client.handshake.query.token;
    if (!clientAccessToken) return { status: false, message: "認証できません" }
    const user = await this.clientService.validateUser(clientAccessToken);
    if (!user) return client.disconnect()

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
  async sendMessageToGroup(@MessageBody() data, @ConnectedSocket() client: Socket) {
    const clientAccessToken = client.handshake.query.token;
    const user = await this.clientService.validateUser(clientAccessToken);
    const { groupId } = data
    if (user && Object.keys(client.rooms).includes(groupId)) {
      this.server.to(groupId).emit('recive:message', {
        ...data,
        author: user.name,
        datetime: new Date()
      })
      return { status: true, data: data };
    } else {
      client.disconnect();
    }
  }


  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }
}
