import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupModule } from 'src/group/group.module';
import { MemberModule } from 'src/member/member.module';
import { SubjectController } from './subject.controller';
import { Subject } from './subject.entity';
import { SubjectService } from './subject.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subject]), GroupModule, MemberModule],
  providers: [SubjectService],
  controllers: [SubjectController],
  exports: [SubjectService]
})
export class SubjectModule {}
