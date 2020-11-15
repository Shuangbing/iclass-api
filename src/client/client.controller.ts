import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards, Request, UseInterceptors, UploadedFile, Res, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GroupService } from 'src/group/group.service';
import { SubjectService } from 'src/subject/subject.service';
import { JionSubjectDto } from './client.dto';
import { ClientService } from './client.service';
import { AmazonS3FileInterceptor } from 'nestjs-multer-extended';
import { FileService } from 'src/file/file.service';
import { File } from 'src/file/file.entity';
import { MemberService } from 'src/member/member.service';
import { Member } from 'src/member/member.entity';

const cryptoRandom = require('crypto-random-string');

@Controller('client')
export class ClientController {
  constructor(
    private readonly subjectService: SubjectService,
    private readonly groupService: GroupService,
    private readonly clientService: ClientService,
    private readonly fileService: FileService,
    private readonly memberService: MemberService
  ) { }

  @Post('subject/jion')
  async jionSubject(@Body() jionSubjectDto: JionSubjectDto) {
    const subject = await this.subjectService.findOneByCode(jionSubjectDto.subjectCode)
    if (subject && subject.password == jionSubjectDto.password) {
      const randomUserId = cryptoRandom({ length: 20, type: 'alphanumeric' })
      const member = new Member()
      member.memberCode = randomUserId;
      member.name = jionSubjectDto.name;
      member.subject = subject;
      await this.memberService.createOne(member);
      const { access_token } = await this.clientService.generateUser({ id: randomUserId, subjectCode: subject.code, name: jionSubjectDto.name })
      return {
        memberId: randomUserId,
        access_token: access_token
      }
    } else {
      throw new HttpException('サブジェクトのパスワードが正しくありません', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard('jwt-client'))
  @Get('subject/waitting')
  async waitGroupingMembers(@Req() req) {
    const { members } = await this.subjectService.findOneWithMember(req.user.subjectCode)
    const self = await this.memberService.findOneByCode(req.user.userId)
    return {
      members: members,
      self: self
    };
  }

  @Get('subject/:subjectId')
  async fetchSubjectByCode(@Param('subjectId') subjectId) {
    const subject = await this.subjectService.fetchOneByCode(subjectId)
    return subject
  }

  @UseGuards(AuthGuard('jwt-client'))
  @Post('group/token')
  async generateGroupToken(@Req() req) {
    const member = await this.memberService.findOneByCode(req.user.userId)
    const { access_token } = await this.clientService.reGenerateGroupUser(req.user, member.group.groupCode)
    return {
      groupCode: member.group.groupCode,
      access_token: access_token
    }
  }

  @UseGuards(AuthGuard('jwt-client'))
  @Get('group')
  async fetchGroupByCode(@Request() req: any) {
    if (!req.user.groupId) throw new HttpException('グループに配属されていません', HttpStatus.BAD_REQUEST);
    const group = await this.groupService.findByGroupId(req.user.groupId)
    return { group: group, user: req.user }
  }


  @UseGuards(AuthGuard('jwt-client'))
  @Post('group/:groupId/upload')
  @UseInterceptors(AmazonS3FileInterceptor('file', { randomFilename: true }))
  async groupFileUpload(@UploadedFile() uploadFile, @Param('groupId') groupId, @Req() req) {
    const group = await this.groupService.findByGroupId(groupId);
    const file = new File()
    const date = new Date();
    file.filename = uploadFile.originalname;
    file.location = uploadFile.Location;
    file.size = uploadFile.size;
    file.groupId = group.id;
    file.memberId = req.user.userId;
    file.memberName = req.user.name;
    file.expiredAt = new Date(date.setDate(date.getDate() + 3));
    const fileCreate = this.fileService.createOne(file);
    return fileCreate;
  }

}
