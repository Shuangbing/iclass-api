import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkspaceModule } from './workspace/workspace.module';
import { UserModule } from './user/user.module';
import { MemberModule } from './member/member.module';
import { SubjectModule } from './subject/subject.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Connection } from 'typeorm';
import { ProjectController } from './project/project.controller';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [TypeOrmModule.forRoot(), WorkspaceModule, UserModule, MemberModule, SubjectModule, ProjectModule],
  controllers: [AppController, ProjectController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) { }
}
