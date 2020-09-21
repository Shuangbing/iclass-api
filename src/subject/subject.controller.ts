import { Controller, Get, Post } from '@nestjs/common';
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
  createAllSubjects() {
    const randomCode = Math.random().toString(36).slice(-8)
    const randomPassword = Math.random().toFixed(6).slice(-6)
    const subject = new Subject()
    subject.title = "Demo Subject"
    subject.description = "this is a demo subject for test."
    subject.code = randomCode
    subject.password = randomPassword
    subject.permitPreGroup = true
    return this.subjectService.createOne(subject);
  }
}
