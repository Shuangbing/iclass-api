import { Module } from '@nestjs/common';
import { GroupModule } from 'src/group/group.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [GroupModule],
  providers: [ChatGateway]
})
export class ChatModule { }
