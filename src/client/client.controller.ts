import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards, Request, UseInterceptors, UploadedFile, Res, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GroupService } from 'src/group/group.service';
import { SubjectService } from 'src/subject/subject.service';
import { JionSubjectDto } from './client.dto';
import { ClientService } from './client.service';
import { AmazonS3FileInterceptor } from 'nestjs-multer-extended';
import { FileService } from 'src/file/file.service';
import { File } from 'src/file/file.entity';
const uuid = require("uuid");

@Controller('client')
export class ClientController {
  constructor(
    private readonly subjectService: SubjectService,
    private readonly groupService: GroupService,
    private readonly clientService: ClientService,
    private readonly fileService: FileService
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

  @UseGuards(AuthGuard('jwt-client'))
  @Get('group/:groupId')
  async fetchGroupByCode(@Param('groupId') groupId, @Request() req: any) {
    const group = await this.groupService.findByGroupId(groupId)
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
