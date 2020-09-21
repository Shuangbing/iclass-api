import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';

@Injectable()
export class SubjectService {
    constructor(
        @InjectRepository(Subject)
        private subjectsRepository: Repository<Subject>,
    ) { }

    findAll(): Promise<Subject[]> {
        return this.subjectsRepository.find({ select: ["code", "password", "title"] });
    }

    async findOneById(id: string): Promise<Subject> {
        return await this.subjectsRepository.findOne(id);
    }

    async createOne(subject: Subject): Promise<Subject> {
        return await this.subjectsRepository.save(subject);
    }
}
