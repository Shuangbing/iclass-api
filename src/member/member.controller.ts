import { Controller, Delete, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GroupService } from 'src/group/group.service';
import { SubjectService } from 'src/subject/subject.service';
import { MemberService } from './member.service';

@ApiTags('member')
@Controller('member')
@UseGuards(AuthGuard('jwt-teacher'))
export class MemberController {

  constructor(
    private readonly memberService: MemberService,
  ) { }

}
