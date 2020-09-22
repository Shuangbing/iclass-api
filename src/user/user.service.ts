import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSignUpDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }


  async createUser(userSignUpDto: UserSignUpDto): Promise<User> {
    return this.usersRepository.save(
      this.usersRepository.create(userSignUpDto)
    );
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findAllWithProjects(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ["subjects"]
    });
  }

  async findOneById(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async findOneByMail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email: email }, { select: ["id", "email", "password"] });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
