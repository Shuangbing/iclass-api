import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { MemberController } from './member/member.controller';
import { SubjectController } from './subject/subject.controller';
import { WorkspaceController } from './workspace/workspace.controller';
import { WorkspaceModule } from './workspace/workspace.module';
import { UserModule } from './user/user.module';
import { MemberModule } from './member/member.module';
import { SubjectModule } from './subject/subject.module';

@Module({
  imports: [WorkspaceModule, UserModule, MemberModule, SubjectModule],
  controllers: [AppController, UserController, MemberController, SubjectController, WorkspaceController],
  providers: [AppService],
})
export class AppModule {}
