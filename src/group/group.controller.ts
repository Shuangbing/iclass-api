import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('group')
@Controller('group')
@UseGuards(AuthGuard('jwt-teacher'))
export class GroupController {}
