import { Module } from '@nestjs/common';
import { GroupModule } from 'src/group/group.module';
import { ClientModule } from '../client.module';

import { ChatGateway } from './chat.gateway';


@Module({
  imports: [GroupModule, ClientModule],
  providers: [ChatGateway],
  exports: [ChatGateway]
})
export class ChatModule { }
