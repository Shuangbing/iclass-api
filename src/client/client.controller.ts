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
import { ApiTags } from '@nestjs/swagger';
import { callbackify } from 'util';

const cryptoRandom = require('crypto-random-string');

@ApiTags('client')
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
      .catch(() => {
        throw new HttpException('サブジェクトが見つかりません', HttpStatus.BAD_REQUEST);
      })
    return subject;
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
      .catch(() => {
        throw new HttpException('グループが見つかりません', HttpStatus.BAD_REQUEST);
      })

    return { group: group, user: req.user }
  }


  @UseGuards(AuthGuard('jwt-client'))
  @Post('group/:groupId/upload')
  @UseInterceptors(AmazonS3FileInterceptor('file', {
    limits: { fileSize: 1e+7 },
    randomFilename: true, fileFilter: (_, file, callback) => {
      const acceptType = ['application/pdf', 'image/gif', 'image/png', 'image/jpeg']
      acceptType.includes(file.mimetype) ? callback(null, true) : callback(null, false)
    }
  }))
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

  @UseGuards(AuthGuard('jwt-client'))
  @Post('member/prep/:memberCode')
  async prepGroupingMember(@Param('memberCode') memberCode, @Req() req) {
    const member = await this.memberService.findOneByCode(req.user.userId)
    const prepMember = await this.memberService.findOneByCode(memberCode)

    if (prepMember && prepMember.subject.code == req.user.subjectCode) {
      if (!member.prepGroupMember && !prepMember.prepGroupMember) {
        await this.memberService.updatePrepMemberByCode(member, prepMember)
      } else {
        throw new HttpException('すでに予備編成されています', HttpStatus.BAD_REQUEST);
      }
    }
    return { status: true }
  }
}
