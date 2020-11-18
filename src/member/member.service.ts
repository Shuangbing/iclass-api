import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository } from 'typeorm';
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

  async findOneByCode(memberCode: string): Promise<Member> {
    return await this.membersRepository.findOne({ "memberCode": memberCode }, { relations: ["group", "subject", "prepGroupMember"] });
  }

  async createOne(member: Member): Promise<Member> {
    return await this.membersRepository.save(member)
  }

  async resetMember(subjectId: number) {
    return await this.membersRepository.delete({ subjectId: subjectId })
  }

  async fetchMemberBySubjectId(subjectId: number) {
    return await this.membersRepository.find({ where: { "subjectId": subjectId }, relations: ["prepGroupMember"] })
  }

  async updatePrepMemberByCode(member: Member, prepMember: Member) {
    member.prepGroupMember = prepMember
    member.isInvited = false
    prepMember.prepGroupMember = member
    prepMember.isInvited = true
    return await this.membersRepository.save([member, prepMember])
  }

  async leaveGroup(subjectId: number) {
    return await this.membersRepository.update({ subjectId: subjectId }, { group: null })
  }
}
