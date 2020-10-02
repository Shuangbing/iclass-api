import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { SubjectService } from 'src/subject/subject.service';
import { JionSubjectDto } from './client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly subjectService: SubjectService) { }

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
      return { status: true, message: "サブジェクト認証完了です", data: { groupId: groups.pop().groupCode } }
    } else {
      throw new HttpException('サブジェクトのパスワードが正しくありません', HttpStatus.BAD_REQUEST);
    }
  }
}
