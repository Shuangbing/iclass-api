import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) { }

  async findAll(): Promise<Member[]> {
    return await this.membersRepository.find()
  }

  async createOne(member: Member): Promise<Member> {
    return await this.membersRepository.save(member)
  }

  async resetMember(subjectId: number) {
    return await this.membersRepository.delete({ subjectId: subjectId })
  }

  async fetchMemberBySubjectId(subjectId: number) {
    return await this.membersRepository.find({ subjectId: subjectId })
  }

  async leaveGroup(subjectId: number) {
    return await this.membersRepository.update({ subjectId: subjectId }, { group: null })
  }
}
