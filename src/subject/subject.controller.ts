import { Body, Controller, Get, Param, Post, UseGuards, Request, NotFoundException, Res, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateSubjectDto } from './subject.dto';
import { Subject } from './subject.entity';
import { SubjectService } from './subject.service';

@Controller('subject')
@UseGuards(AuthGuard('jwt'))
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) { }

  @Get()
  findAllSubjects(@Request() req: any) {
    return this.subjectService.findAllByUserId(req.user.id);
  }

  @Get(':subjectCode')
  async findOneSubject(@Param('subjectCode') subjectCode, @Request() req: any, @Res() res: any) {
    const subject = await this.subjectService.findOneByCode(subjectCode, req.user.id);
    return subject ?? res.status(404).send()
  }

  @Post()
  createAllSubjects(@Body() createSubjectDto: CreateSubjectDto, @Request() req: any) {
    const randomCode = Math.random().toString(36).slice(-8)
    const randomPassword = Math.random().toFixed(6).slice(-6)
    const subject = new Subject()
    subject.title = createSubjectDto.title
    subject.description = createSubjectDto.description
    subject.code = randomCode
    subject.password = randomPassword
    subject.permitPreGroup = createSubjectDto.permitPreGroup
    subject.userId = req.user.id
    return this.subjectService.createOne(subject);
  }
}
