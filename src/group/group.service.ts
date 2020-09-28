import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
  ) { }

  async findAll(): Promise<Group[]> {
    return await this.groupsRepository.find()
  }

  async createMany(groups: Group[]): Promise<Group[]> {
    return await this.groupsRepository.save(groups)
  }
}
