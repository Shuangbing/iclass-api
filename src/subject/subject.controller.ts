import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateSubjectDto } from './subject.dto';
import { Subject } from './subject.entity';
import { SubjectService } from './subject.service';

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) { }

  @Get()
  findAllSubjects() {
    return this.subjectService.findAll();
  }

  @Post()
  createAllSubjects(@Body() createSubjectDto: CreateSubjectDto) {
    const randomCode = Math.random().toString(36).slice(-8)
    const randomPassword = Math.random().toFixed(6).slice(-6)
    const subject = new Subject()
    subject.title = createSubjectDto.title
    subject.description = createSubjectDto.description
    subject.code = randomCode
    subject.password = randomPassword
    subject.permitPreGroup = createSubjectDto.permitPreGroup
    return this.subjectService.createOne(subject);
  }
}
