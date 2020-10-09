import { Body, Controller, Get, Param, Post, UseGuards, Request, NotFoundException, Res, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Group } from 'src/group/group.entity';
import { GroupService } from 'src/group/group.service';
import { CreateGroupDto, CreateSubjectDto } from './subject.dto';
import { Subject } from './subject.entity';
import { SubjectService } from './subject.service';

const uuid = require("uuid");
const cryptoRandom = require('crypto-random-string');

@ApiTags('subject')
@Controller('subject')
@UseGuards(AuthGuard('jwt-teacher'))
export class SubjectController {
  constructor(
    private readonly subjectService: SubjectService,
    private readonly groupService: GroupService
  ) { }

  @Get()
  findAllSubjects(@Request() req: any) {
    return this.subjectService.findAllByUserId(req.user.id);
  }

  @Get(':subjectCode')
  async findOneSubject(@Param('subjectCode') subjectCode, @Request() req: any) {
    const subject = await this.subjectService.findOneByCodeAndUser(subjectCode, req.user.id);
    return subject
  }

  @Post()
  createAllSubjects(@Body() createSubjectDto: CreateSubjectDto, @Request() req: any) {
    const randomCode = cryptoRandom({ length: 10, type: 'alphanumeric' })
    const randomPassword = cryptoRandom({ length: 6, type: 'numeric' })
    const subject = new Subject()
    subject.title = createSubjectDto.title
    subject.description = createSubjectDto.description
    subject.code = randomCode
    subject.password = randomPassword
    subject.permitPreGroup = createSubjectDto.permitPreGroup
    subject.userId = req.user.id
    return this.subjectService.createOne(subject);
  }

  @Post(':subjectCode/group')
  async createGroup(@Param('subjectCode') subjectCode, @Body() createGroupDto: CreateGroupDto, @Request() req: any) {
    const subject = await this.subjectService.findOneByCodeAndUser(subjectCode, req.user.id)
    const groupArray = []
    for (let index = 1; index <= createGroupDto.amount; index++) {
      const group = new Group()
      group.title = `グループ${index}`
      group.groupCode = uuid.v4()
      group.subjectId = subject.id
      groupArray.push(group)
    }
    return this.groupService.createMany(groupArray);
  }

  @Get(':subjectCode/group')
  async findGroupBySubject(@Param('subjectCode') subjectCode, @Request() req: any) {
    const subject = await this.subjectService.findOneWithGroupAndUser(subjectCode, req.user.id);
    return subject.groups;
  }
}

