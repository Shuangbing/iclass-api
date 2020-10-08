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
import { ChatModule } from './client/chat/chat.module';
import { ClientModule } from './client/client.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    url: process.env.DATABASE_URL || 'mysql://root:root@localhost:3306/iclass-dev',
    entities: ["dist/**/*.entity{.ts,.js}"],
    synchronize: true,
  }), UserModule, MemberModule, SubjectModule, GroupModule, AuthModule, ClientModule, ChatModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) { }
}
