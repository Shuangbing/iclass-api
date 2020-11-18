import { Body, Controller, Get, Param, Post, UseGuards, Request, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { group } from 'console';
import { Group } from 'src/group/group.entity';
import { GroupService } from 'src/group/group.service';
import { MemberService } from 'src/member/member.service';
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
    private readonly groupService: GroupService,
    private readonly memberSerivce: MemberService
  ) { }

  @Get()
  findAllSubjects(@Request() req: any) {
    return this.subjectService.findAllByUserId(req.user.id);
  }

  @Get(':subjectCode')
  async findOneSubject(@Param('subjectCode') subjectCode, @Request() req: any) {
    const subject = await this.subjectService.findOneByCodeAndUser(subjectCode, req.user.id);
    if (!subject) throw new HttpException('サブジェクトが見つかりません', HttpStatus.BAD_REQUEST)
    return subject
  }

  @Delete(':subjectCode')
  async deleteOneSubject(@Param('subjectCode') subjectCode, @Request() req: any) {
    const subject = await this.subjectService.deleteOneByCodeAndUser(subjectCode, req.user.id);
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
    const subject = await this.subjectService.findOneWithGroupAndUser(subjectCode, req.user.id)
    if (subject.groups.length != 0) throw new HttpException('すでにグループ編成しました', HttpStatus.BAD_REQUEST)
    if (subject.members.length < 2) throw new HttpException('最低2名のメンバーが必要です', HttpStatus.BAD_REQUEST)
    let members = await this.memberSerivce.fetchMemberBySubjectId(subject.id)
    const noPrepGroupingMembers = members.filter((member) => !member.prepGroupMember)
    const prepGroupingMembers = []

    members.filter((member) => member.prepGroupMember).map((member) => {
      if (!member.isInvited) {
        prepGroupingMembers.push([member, member.prepGroupMember])
      }
    })

    members = [...prepGroupingMembers.flat(), ...noPrepGroupingMembers]

    const groupMembersCount = createGroupDto.amount
    const groupCount = Number(members.length / groupMembersCount)
    const groupArray = []
    let groupIndex = 1

    for (groupIndex; groupIndex <= groupCount; groupIndex++) {
      const group = new Group()
      group.title = `グループ${groupIndex}`
      group.groupCode = uuid.v4()
      group.subjectId = subject.id
      group.members = []
      for (let gIndex = 0; gIndex < groupMembersCount; gIndex++) group.members.push(members.shift())
      groupArray.push(group)
    }

    if (members.length > 1) {
      const group = new Group()
      group.title = `グループ${groupIndex}`
      group.groupCode = uuid.v4()
      group.subjectId = subject.id
      group.members = []
      group.members.push(...members)
      groupArray.push(group)
    } else {
      groupArray.slice(-1).pop().members.push(...members)
    }
    return await this.groupService.createMany(groupArray)
  }

  @Get(':subjectCode/group')
  async findGroupBySubject(@Param('subjectCode') subjectCode, @Request() req: any) {
    const subject = await this.subjectService.findOneWithGroupAndUser(subjectCode, req.user.id);
    return subject.groups;
  }

  @Delete(':subjectCode/group')
  async resetGroup(@Param('subjectCode') subjectCode, @Request() req: any) {
    const subject = await this.subjectService.findOneByCodeAndUser(subjectCode, req.user.id);
    await this.memberSerivce.leaveGroup(subject.id)
    await this.groupService.resetGroup(subject.id);
    return { status: true };
  }

  @Get(':subjectCode/member/waitting')
  async fetchWaittingMember(@Param('subjectCode') subjectCode, @Request() req: any) {
    const { members } = await this.subjectService.findOneWithGroupAndUser(subjectCode, req.user.id)
    return members;
  }
}

