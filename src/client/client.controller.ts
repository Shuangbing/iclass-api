import { Controller, Get, Param } from '@nestjs/common';
import { SubjectService } from 'src/subject/subject.service';

@Controller('client')
export class ClientController {
    constructor(private readonly subjectService: SubjectService) { }

    @Get('subject/:subjectId')
    async fetchSubjectByCode(@Param('subjectId') subjectId) {
        const subject = await this.subjectService.findOneByCode(subjectId)
        return subject
    }
}
