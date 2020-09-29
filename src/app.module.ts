import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MemberModule } from './member/member.module';
import { SubjectModule } from './subject/subject.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Connection } from 'typeorm';
import { GroupModule } from './group/group.module';
import { AuthModule } from './auth/auth.module';
import { ClientController } from './client/client.controller';
import { ChatModule } from './client/chat/chat.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, MemberModule, SubjectModule, GroupModule, AuthModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) { }
}
