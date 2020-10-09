import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('member')
@Controller('member')
export class MemberController {}
