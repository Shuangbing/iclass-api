import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Response, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GroupService } from 'src/group/group.service';
import { SubjectService } from 'src/subject/subject.service';
import { JionSubjectDto } from './client.dto';
import { ClientService } from './client.service';
const uuid = require("uuid");

@Controller('client')
export class ClientController {
  constructor(
    private readonly subjectService: SubjectService,
    private readonly groupService: GroupService,
    private readonly clientService: ClientService
  ) { }

  @Get('subject/:subjectId')
  async fetchSubjectByCode(@Param('subjectId') subjectId) {
    const subject = await this.subjectService.fetchOneByCode(subjectId)
    return subject
  }

  @Post('subject/jion')
  async jionSubject(@Body() jionSubjectDto: JionSubjectDto) {
    const subject = await this.subjectService.findOneByCode(jionSubjectDto.subjectCode)
    const { groups } = await this.subjectService.findOneWithGroup(jionSubjectDto.subjectCode)

    if (subject && subject.password == jionSubjectDto.password) {
      const { access_token } = await this.clientService.generateUser({ id: uuid.v4(), subjectCode: subject.code, name: jionSubjectDto.name })
      return {
        groupId: groups.pop().groupCode, access_token: access_token
      }
    } else {
      throw new HttpException('サブジェクトのパスワードが正しくありません', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('group/:groupId')
  async fetchGroupByCode(@Param('groupId') groupId, @Request() req: any) {
    const group = await this.groupService.findByGroupId(groupId)
    return { group: group, user: req.user }
  }

}
