import { Controller, Delete, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GroupService } from 'src/group/group.service';
import { SubjectService } from 'src/subject/subject.service';
import { MemberService } from './member.service';

@ApiTags('member')
@Controller('member')
export class MemberController {

  constructor(
    private readonly memberService: MemberService,
  ) { }

}
