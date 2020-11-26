import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
  ) { }
  
  async findAll(): Promise<File[]> {
    return await this.filesRepository.find()
  }

  async createOne(file: File): Promise<File> {
    return await this.filesRepository.save(file);
  }
}
