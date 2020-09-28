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

  findAllByUserId(userId: number): Promise<Subject[]> {
    return this.subjectsRepository.find({ select: ["code", "password", "title"], where: { "userId": userId } })
  }

  async findOneById(id: number, userId: number): Promise<Subject> {
    return await this.subjectsRepository.findOne(id, { where: { "userId": userId } });
  }

  async findOneByCode(subjectCode: string, userId: number): Promise<Subject> {
    return await this.subjectsRepository.findOne({ select: ["id", "code", "password", "title"], where: { "code": subjectCode, "userId": userId } })
  }

  async createOne(subject: Subject): Promise<Subject> {
    return await this.subjectsRepository.save(subject);
  }
}
